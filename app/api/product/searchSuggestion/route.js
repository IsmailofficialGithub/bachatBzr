import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get('q')
    console.log(keyword)

    if (!keyword) {
      return NextResponse.json({
        success: false,
        message: 'Search keyword is required',
        error: 'Missing query parameter: q'
      }, { status: 400 })
    }

    const searchTerm = keyword.toLowerCase()

    // 1. Match product names
    const { data: nameResults, error: nameError } = await supabase
      .from('products')
      .select('name')
      .ilike('name', `%${searchTerm}%`)

    if (nameError) {
      return NextResponse.json({
        success: false,
        message: 'Name suggestion failed',
        error: nameError.message
      }, { status: 500 })
    }

    // 2. Match tags (text[]) - matches elements of array
    const { data: tagResults, error: tagError } = await supabase
      .from('products')
      .select('tags')
      .contains('tags', [searchTerm])

    if (tagError) {
      return NextResponse.json({
        success: false,
        message: 'Tag suggestion failed',
        error: tagError.message
      }, { status: 500 })
    }

    // 3. Match categories (jsonb[])
    const { data: categoryResults, error: categoryError } = await supabase
      .from('products')
      .eq("sold", false)
      .select('categories')
        .filter('categories', 'cs', `["${searchTerm}"]`)

    if (categoryError) {
      return NextResponse.json({
        success: false,
        message: 'Category suggestion failed',
        error: categoryError.message
      }, { status: 500 })
    }

    // Collect all suggestions
    const suggestionsSet = new Set()

    // Add product names
    nameResults?.forEach(item => {
      if (item?.name?.toLowerCase().includes(searchTerm)) {
        suggestionsSet.add(item.name.toLowerCase())
      }
    })

    // Add matching tags
    tagResults?.forEach(item => {
      item.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          suggestionsSet.add(tag.toLowerCase())
        }
      })
    })

    // Add matching categories
    categoryResults?.forEach(item => {
      item.categories?.forEach(cat => {
        if (cat.toLowerCase().includes(searchTerm)) {
          suggestionsSet.add(cat.toLowerCase())
        }
      })
    })

    // Convert to array and limit suggestions (e.g. top 10)
    const suggestions = Array.from(suggestionsSet).slice(0, 10)

    return NextResponse.json({
      success: true,
      message: `${suggestions.length} suggestions found.`,
      data: suggestions
    }, { status: 200 })

  } catch (err) {
    console.log(err)
    return NextResponse.json({
      success: false,
      message: 'Error generating suggestions.',
      error: err.message
    }, { status: 500 })
  }
}
