import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required.' },
        { status: 400 }
      );
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch orders.',
          error: error.message,
        },
        { status: 500 }
      );
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No orders found for this user.',
        stats: [],
      });
    }

    const totalOrders = orders.length;

    const totalSpent = orders.reduce((acc, order) => {
      try {
        const parsed =
          typeof order.total_amount === 'string'
            ? JSON.parse(order.total_amount)
            : order.total_amount;

        return acc + (parsed?.final_total || 0);
      } catch {
        return acc;
      }
    }, 0);

    const pendingOrders = orders.filter(
      (order) => order.order_status === 'pending'
    ).length;

    const latestOrder = [...orders].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const stats = [
      { title: 'Total Orders', value: `${totalOrders}` },
      { title: 'Total Spent', value: `PKR ${totalSpent.toLocaleString()}` },
      { title: 'Pending Orders', value: `${pendingOrders}` },
      latestOrder
        ? {
            title: 'Last Order',
            value: latestOrder.order_status || 'Unknown',
            subtext: new Date(latestOrder.created_at).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ),
          }
        : { title: 'Last Order', value: 'N/A', subtext: 'No orders yet' },
    ];

    return NextResponse.json({
      success: true,
      message: 'User statistics retrieved successfully.',
      stats,
    });
  } catch (err) {
    console.error('[USER_STATS_API_ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        message:
          'An unexpected error occurred while retrieving user statistics.',
        error: err?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
