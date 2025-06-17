import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Cache for database connection to avoid repeated connections
let cachedSupabase = supabase;

// Helper function to validate and parse numeric parameters
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

// Helper function to build price filter conditions
function buildPriceFilter(query, min, max) {
  if (min !== null && max !== null) {
    if (min > max) {
      throw new Error("Minimum price cannot be greater than maximum price");
    }
    return query.gte("price", min).lte("price", max);
  }

  if (min !== null) {
    return query.gte("price", min);
  }

  if (max !== null) {
    return query.lte("price", max);
  }

  return query;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate parameters
    const min = parseNumericParam(searchParams.get("min"), "min");
    const max = parseNumericParam(searchParams.get("max"), "max");

    // Additional query parameters for pagination and sorting
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20")),
    );
    const sortBy = searchParams.get("sortBy") || "_id";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? false : true;

    // Validate sortBy parameter
    const allowedSortFields = [
      "_id",
      "price",
      "name",
      "created_at",
      "updated_at",
    ];
    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          success:false,
          error: "Invalid sortBy parameter",
          allowedFields: allowedSortFields,
        },
        { status: 400 },
      );
    }

    // Build optimized single query instead of two separate queries
    let query = cachedSupabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("sold", false)
      .range((page - 1) * limit, page * limit - 1)
      .order(sortBy, { ascending: sortOrder });

    // Apply price filters
    query = buildPriceFilter(query, min, max);

    // Execute query
    const { data: products, error, count } = await query;

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        {
          success:false,
          error: "Database query failed",
          message:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Internal server error",
        },
        { status: 500 },
      );
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Return optimized response with metadata
    return NextResponse.json(
      {
        success:true,
        message:"SuccessFully getting data",
        data: products || [],
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count || 0,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          priceRange: {
            min: min,
            max: max,
          },
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("API Error:", err);

    // Handle validation errors separately
    if (
      err.message.includes("Invalid") ||
      err.message.includes("cannot be greater than")
    ) {
      return NextResponse.json(
        {
          success:false,
          error: "Validation Error",
          message: err.message,
        },
        { status: 400 },
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        success:false,
        error: "Internal Server Error",
        message:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
