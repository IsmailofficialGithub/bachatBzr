import { supabase } from "@/lib/supabaseSetup";
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

// Helper function to validate size parameters
function parseSizeParam(value) {
  if (!value) return null;
  
  // Define valid sizes (you can customize this based on your needs)
  const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  const normalizedValue = value.toString().toUpperCase();
  
  if (validSizes.includes(normalizedValue)) {
    return normalizedValue;
  }
  
  // Check if it's a numeric size
  const numericSize = Number(value);
  if (!isNaN(numericSize) && numericSize > 0) {
    return numericSize.toString();
  }
  
  throw new Error(`Invalid size parameter: ${value}. Valid sizes are: ${validSizes.join(', ')}`);
}

// Helper function to validate and parse category parameter
function parseCategoryParam(value) {
  if (!value) return null;
  
  // Basic validation - ensure it's a non-empty string
  const trimmedValue = value.toString().trim();
  if (trimmedValue.length === 0) {
    throw new Error("Category parameter cannot be empty");
  }
  
  // Optional: Add more validation rules if needed
  // For example, check against allowed categories or format
  return trimmedValue.toLowerCase(); // Normalize to lowercase for consistent filtering
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

// Helper function to build size filter conditions
function buildSizeFilter(query, sizes) {
  if (!sizes || sizes.length === 0) return query;
  
  // If only one size, use JSON operator to filter nested field
  if (sizes.length === 1) {
    return query.eq("additional_information->>Size", sizes[0]);
  }
  
  // If multiple sizes, use in with JSON operator
  return query.in("additional_information->>Size", sizes);
}

// Helper function to build category filter conditions
function buildCategoryFilter(query, categorySlug) {
  if (!categorySlug) return query;
  
  // Use PostgreSQL JSONB operator to check if the category array contains the slug
  // This will match if the categorySlug exists anywhere in the JSONB array
  return query.contains("categories", `["${categorySlug}"]`);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate price parameters
    const min = parseNumericParam(searchParams.get("min"), "min");
    const max = parseNumericParam(searchParams.get("max"), "max");

    // Parse and validate category parameter
    const categorySlug = parseCategoryParam(searchParams.get("category"));

    // Parse and validate size parameters
    const sizeParam = searchParams.get("sizes");
    const allSizeParams = searchParams.getAll("sizes"); // Get all 'sizes' parameters
    let sizes = [];
    
    if (allSizeParams.length > 1) {
      // Handle multiple query parameters: ?sizes=7&sizes=10
      sizes = allSizeParams.map(size => parseSizeParam(size)).filter(Boolean);
    } else if (sizeParam) {
      try {
        // First, try to parse as JSON array (e.g., ["7","10"])
        let sizeArray;
        if (sizeParam.startsWith('[') && sizeParam.endsWith(']')) {
          sizeArray = JSON.parse(sizeParam);
        } else {
          // Handle comma-separated values (e.g., "7,10")
          sizeArray = sizeParam.split(',').map(s => s.trim());
        }
        
        sizes = sizeArray.map(size => parseSizeParam(size)).filter(Boolean);
      } catch (parseError) {
        throw new Error(`Invalid sizes parameter format: ${sizeParam}`);
      }
    }

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
      "additional_information->>Size", // JSON field for size
      "created_at",
      "updated_at",
    ];
    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          success: false,
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

    // Apply size filters
    query = buildSizeFilter(query, sizes);

    // Apply category filters
    query = buildCategoryFilter(query, categorySlug);

    // Execute query
    const { data: products, error, count } = await query;

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        {
          success: false,
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
        success: true,
        message: "Successfully getting data",
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
          sizes: sizes.length > 0 ? sizes : null,
          category: categorySlug,
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
      err.message.includes("cannot be greater than") ||
      err.message.includes("cannot be empty")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: err.message,
        },
        { status: 400 },
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        success: false,
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