import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch all categories
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched categories",
      data
    }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      error: 'Failed to fetch categories'
    }, { status: 500 });
  }
}

// POST: Create a new category
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, parent_id } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if category already exists
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name.trim());

    if (checkError) {
      console.error('Error checking existing categories:', checkError.message);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingCategories && existingCategories.length > 0) {
      return NextResponse.json({
        error: 'A category with this name already exists'
      }, { status: 409 });
    }

    // Insert new category
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: name.trim(), description, parent_id }])
      .select();

    if (error) {
      console.error('Error creating category:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      categories: data[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      error: 'Failed to create category'
    }, { status: 500 });
  }
}
