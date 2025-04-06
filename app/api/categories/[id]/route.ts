import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fetch a specific category
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching category:', error.message);
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// Update a specific category
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, description, parent_id } = await req.json();

  try {
    const { error } = await supabase
      .from('categories')
      .update({ name, description, parent_id })
      .eq('id', id);

    if (error) {
      console.error('Error updating category:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Category updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// Delete a specific category
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      console.error('Error deleting category:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
