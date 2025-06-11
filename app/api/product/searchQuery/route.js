import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!keyword) {
      return NextResponse.json({
        success: false,
        message: 'Search keyword is required',
        error: 'Missing query parameter: q'
      }, { status: 400 })
    }

    const searchTerm = keyword.toLowerCase()
    const from = (page - 1) * limit
    const to = from + limit - 1

    // 1. Search in name, short_description, long_description
    const { data: textMatches, error: textError } = await supabase
      .from('products')
      .select('*')
      .or(
        `name.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%,long_description.ilike.%${searchTerm}%`
      )

    if (textError) {
      return NextResponse.json({
        success: false,
        message: 'Text search failed',
        error: textError.message
      }, { status: 500 })
    }

    // 2. Search in tags (text[])
    const { data: tagMatches, error: tagError } = await supabase
      .from('products')
      .select('*')
      .eq("sold", false)
      .contains('tags', [searchTerm])

    if (tagError) {
      return NextResponse.json({
        success: false,
        message: 'Tag search failed',
        error: tagError.message
      }, { status: 500 })
    }
    const { data: categoriesMatches, error: categoriesError } = await supabase
      .from('products')
      .select('*')
      .filter('categories', 'cs', `["${searchTerm}"]`)

    if (categoriesError) {
      return NextResponse.json({
        success: false,
        message: 'Tag search failed',
        error: categoriesError.message
      }, { status: 500 })
    }

    // 3. Combine and deduplicate by product ID
    const combined = [...textMatches, ...tagMatches,...categoriesMatches]
    const uniqueProducts = combined.filter(
      (item, index, self) => index === self.findIndex(p => p.id === item.id)
    )

    // 4. Apply pagination on the merged result
    const paginatedResults = uniqueProducts.slice(from, to + 1)

    return NextResponse.json({
      success: true,
      message: `${paginatedResults.length} products found on page ${page}.`,
      data: paginatedResults,
      pagination: {
        total: uniqueProducts.length,
        page,
        limit,
        totalPages: Math.ceil(uniqueProducts.length / limit)
      }
    }, { status: 200 })

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request.',
      error: err.message
    }, { status: 500 })
  }
}
