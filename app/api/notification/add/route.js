import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = body.userId;
    const orderId = body.orderId;
    const message=body.message || "You have a new notification regarding your order.";
    const title=body.title || "Order Notification";
    const type= body.type || "order_created";

    // Create notification
    const result = await createNotification({
      user_id: userId,
      title: title,
      message: message,
      type: type,
      order_id: orderId,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create notification",
          error: result.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      data:{
        userId,
        orderId,
        title,
        message,
        type,
      }
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
