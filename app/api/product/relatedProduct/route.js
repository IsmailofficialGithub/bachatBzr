// app/api/search-products/route.js
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Check if request body can be parsed
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid JSON in request body',
          error: parseError.message
        },
        { status: 400 }
      );
    }

    // Destructure and validate tags
    const { tags } = body;

    // Validate that tags exist
    if (!tags ) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing required fields: tags ',
          details: 'Please provide a tags array in the request body'
        },
        { status: 400 }
      );
    }
    
    // Validate that tags is an array
    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid data type: tags must be an array',
          details: `Received ${typeof tags} instead of array`
        },
        { status: 400 }
      );
    }
    
    // Validate that tags array is not empty
    if (tags.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Empty tags array',
          details: 'Please provide at least one tag to search for'
        },
        { status: 400 }
      );
    }

    // Query Supabase for products that match any of the tags
    const { data, error } = await supabase
      .from('products')
      .select('*')
       .eq("sold", false)
      .contains('tags', tags)
      
    // Handle Supabase query errors
    if (error) {
      console.error('Supabase query error:', error);
      
      // Determine if it's a database error or a connection error
      if (error.code) {
        // Database error with error code
        return NextResponse.json(
          { 
            success: false,
            message: 'Database query failed',
            error: error.message,
            code: error.code,
            details: 'The database rejected the query'
          },
          { status: 500 }
        );
      } else {
        // Connection or other error
        return NextResponse.json(
          { 
            success: false,
            message: 'Failed to communicate with database',
            error: error.message
          },
          { status: 503 }
        );
      }
    }
    
    // Check if data exists but is empty
    if (!data || data.length === 0) {
      return NextResponse.json(
        { 
          success: true,
          message: 'No products found matching the provided tags',
          products: [],
          count: 0,
          tags: tags
        },
        { status: 200 }
      );
    }
    
    // Return successful response with the matching products
    return NextResponse.json(
      { 
        success: true,
        message: 'Products retrieved successfully',
        products: data,
        count: data.length,
        tags: tags
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Unhandled API route error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: error.message || 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
