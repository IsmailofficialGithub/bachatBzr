

import { getUserNotifications } from '@/lib/notifications';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filter = searchParams.get('filter') || 'all'; // 'all', 'unread', 'read'

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Pass filter to the getUserNotifications function
    const result = await getUserNotifications(userId, page, limit, filter);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
      total: result.total,
      page,
      limit,
      pages: Math.ceil(result.total / limit),
    });
  } catch (err) {
    console.error('Get notifications API error:', err);
    return NextResponse.json(
      { success: false, error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}