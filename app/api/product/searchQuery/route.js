


import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function parseNumericParam(value, paramName) {
  if (!value) return null;

  const parsed = Number(value);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error(
      `Invalid ${paramName} parameter: must be a non-negative number`,
    );
  }
  return parsed;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const min = parseNumericParam(searchParams.get("min"), "min");
    const max = parseNumericParam(searchParams.get("max"), "max");

    // Validate min/max relationship
    if (min !== null && max !== null && min > max) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum price cannot be greater than maximum price",
          error: "Invalid price range",
        },
        { status: 400 },
      );
    }

    if (!keyword) {
      return NextResponse.json(
        {
          success: false,
          message: "Search keyword is required",
          error: "Missing query parameter: q",
        },
        { status: 400 },
      );
    }

    const searchTerm = keyword.toLowerCase();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 1. Search in name, short_description, long_description
    const { data: textMatches, error: textError } = await supabase
      .from("products")
      .select("*")
      .or(
        `name.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%,long_description.ilike.%${searchTerm}%`,
      );

    if (textError) {
      return NextResponse.json(
        {
          success: false,
          message: "Text search failed",
          error: textError,
        },
        { status: 500 },
      );
    }

    // 2. Search in tags (text[])
    const { data: tagMatches, error: tagError } = await supabase
      .from("products")
      .select("*")
      .eq("sold", false)
      .contains("tags", [searchTerm]);

    if (tagError) {
      return NextResponse.json(
        {
          success: false,
          message: "Tag search failed",
          error: tagError.message,
        },
        { status: 500 },
      );
    }

    const { data: categoriesMatches, error: categoriesError } = await supabase
      .from("products")
      .select("*")
      .filter("categories", "cs", `["${searchTerm}"]`);

    if (categoriesError) {
      return NextResponse.json(
        {
          success: false,
          message: "Categories search failed",
          error: categoriesError.message,
        },
        { status: 500 },
      );
    }

    // 3. Combine and deduplicate by product ID
    const combined = [...textMatches, ...tagMatches, ...categoriesMatches];
    const uniqueProducts = combined.filter(
      (item, index, self) => index === self.findIndex((p) => p.id === item.id),
    );

    // 4. Apply price filtering if min or max is provided
    let filteredProducts = uniqueProducts;
    
    if (min !== null || max !== null) {
      filteredProducts = uniqueProducts.filter((product) => {
        const price = parseFloat(product.price);
        
        // Skip products with invalid prices
        if (isNaN(price)) {
          return false;
        }
        
        // Apply min filter if provided
        if (min !== null && price < min) {
          return false;
        }
        
        // Apply max filter if provided
        if (max !== null && price > max) {
          return false;
        }
        
        return true;
      });
    }

    // 5. Apply pagination on the filtered result
    const paginatedResults = filteredProducts.slice(from, to + 1);

    return NextResponse.json(
      {
        success: true,
        message: `${paginatedResults.length} products found on page ${page}.`,
        data: paginatedResults,
        pagination: {
          total: filteredProducts.length,
          page,
          limit,
          totalPages: Math.ceil(filteredProducts.length / limit),
        },
        filters: {
          keyword: searchTerm,
          priceRange: {
            min: min,
            max: max,
          },
        },
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
        error: err.message,
      },
      { status: 500 },
    );
  }
}