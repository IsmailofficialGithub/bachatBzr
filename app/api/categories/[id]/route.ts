import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseSetup';
import { CheckRouteRole } from '@/lib/auth-token';

// GET: Fetch a specific category
export async function GET(req, context) {
  const { id } = context.params;

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

// PUT: Update a specific category
export async function PUT(req, context) {
  const { id } = context.params;
  

const {  success, error } = await CheckRouteRole(req,["admin"]);
 if (error || !success) {
    return NextResponse.json({ error }, { status: 401 })
  }

  try {
    const body = await req.json();
    const { name, description, parent_id } = body;

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

// DELETE: Delete a specific category
export async function DELETE(req, context) {
  const {  success, error } = await CheckRouteRole(req,["admin"]);
 if (error || !success) {
    return NextResponse.json({ error }, { status: 401 })
  }
  const { id } = context.params;

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

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
