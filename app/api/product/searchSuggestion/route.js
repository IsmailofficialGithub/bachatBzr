import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get('q')

    if (!keyword) {
      return NextResponse.json({
        success: false,
        message: 'Search keyword is required',
        error: 'Missing query parameter: q'
      }, { status: 400 })
    }

    const searchTerm = keyword.toLowerCase().trim()
    
    // Early return for very short search terms to reduce load
    if (searchTerm.length < 2) {
      return NextResponse.json({
        success: true,
        message: '0 suggestions found.',
        data: []
      }, { status: 200 })
    }

    // Single optimized query combining all search criteria
    const { data: results, error } = await supabase
      .from('products')
      .select('name, tags, categories')
      .or(`name.ilike.%${searchTerm}%,tags.cs.{${searchTerm}},categories.cs.["${searchTerm}"]`)
      .limit(50) // Limit database results to reduce data transfer
      console.log(results)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({
        success: false,
        message: 'Search failed',
        error: error.message
      }, { status: 500 })
    }

    // Process results efficiently using a Set for deduplication
    const suggestionsSet = new Set()
    const maxSuggestions = 10

    for (const item of results) {
      // Stop early if we have enough suggestions
      if (suggestionsSet.size >= maxSuggestions) break

      // Check name match
      if (item.name?.toLowerCase().includes(searchTerm)) {
        suggestionsSet.add(item.name.toLowerCase())
      }

      // Check tag matches
      if (item.tags?.length) {
        for (const tag of item.tags) {
          if (suggestionsSet.size >= maxSuggestions) break
          if (tag?.toLowerCase().includes(searchTerm)) {
            suggestionsSet.add(tag.toLowerCase())
          }
        }
      }

      // Check category matches
      if (item.categories?.length) {
        for (const category of item.categories) {
          if (suggestionsSet.size >= maxSuggestions) break
          if (category?.toLowerCase().includes(searchTerm)) {
            suggestionsSet.add(category.toLowerCase())
          }
        }
      }
    }

    const suggestions = Array.from(suggestionsSet).slice(0, maxSuggestions)

    return NextResponse.json({
      success: true,
      message: `${suggestions.length} suggestions found.`,
      data: suggestions
    }, { status: 200 })

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({
      success: false,
      message: 'Error generating suggestions.',
      error: err.message
    }, { status: 500 })
  }
}

// Alternative version with even better performance using RPC
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get('q')

    if (!keyword) {
      return NextResponse.json({
        success: false,
        message: 'Search keyword is required',
        error: 'Missing query parameter: q'
      }, { status: 400 })
    }

    const searchTerm = keyword.toLowerCase().trim()
    
    if (searchTerm.length < 2) {
      return NextResponse.json({
        success: true,
        message: '0 suggestions found.',
        data: []
      }, { status: 200 })
    }

    // Use a stored procedure for maximum performance
    const { data: suggestions, error } = await supabase
      .rpc('get_search_suggestions', {
        search_term: searchTerm,
        max_results: 10
      })

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({
        success: false,
        message: 'Search failed',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${suggestions?.length || 0} suggestions found.`,
      data: suggestions || []
    }, { status: 200 })

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({
      success: false,
      message: 'Error generating suggestions.',
      error: err.message
    }, { status: 500 })
  }
}