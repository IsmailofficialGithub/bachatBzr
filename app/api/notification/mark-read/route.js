import { markNotificationsAsRead } from '@/lib/notifications';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { notificationIds, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Notification IDs are required and must be an array' },
        { status: 400 }
      );
    }

    const result = await markNotificationsAsRead(notificationIds, userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      updatedCount: result.updatedCount || notificationIds.length,
    });
  } catch (err) {
    console.error('Mark notifications as read API error:', err);
    return NextResponse.json(
      { success: false, error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}