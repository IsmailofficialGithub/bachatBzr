import { supabase } from "@/lib/supabaseSetup";
import { NextResponse } from 'next/server'

export async function GET(request, context) {
  const { slug } = context.params
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!slug) {
    return NextResponse.json(
      { success: false, message: 'Missing category slug' },
      { status: 400 }
    )
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' }) // also get total count
      .eq('sold', false)
      .contains('categories', JSON.stringify([slug]))
      .range(from, to)

    if (error) {
      return NextResponse.json(
        { success: false, message: 'Database query failed', error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Products fetched successfully',
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { success: false, message: 'Unexpected Error', error: err.message || err },
      { status: 500 }
    )
  }
}
