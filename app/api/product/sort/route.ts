// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Adjust path as necessary

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sort = searchParams.get('sort') === 'des' ? 'desc' : 'asc';

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Fetch total count for pagination
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to get total product count',
          error: countError.message,
          products: [],
        },
        { status: 500 }
      );
    }
    console.log(sort)

    // Fetch paginated data
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: sort === 'asc' })
      .range(from, to);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch products',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Products fetched successfully',
        error: null,
        products,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems: count || 0,
          totalPages: count ? Math.ceil(count / limit) : 1,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
        error: error.message || 'Unknown error',
        products: [],
      },
      { status: 500 }
    );
  }
}
