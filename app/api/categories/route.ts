import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fetch all categories
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

    return NextResponse.json({success:true,message:"Successfully fetched categories",data}, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// Create a new category
export async function POST(req: Request) {
  try {
    const { name, description, parent_id } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, description, parent_id }])
      .select();

    if (error) {
      console.error('Error creating category:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({success:true,message:"Successfully Categories is created",categories:data[0]}, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
