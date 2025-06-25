import { deletingNotifications } from "@/lib/notifications";
import { NextResponse } from "next/server";

export const DELETE = async (req) => {
  try {
    const { userId, notificationIds } = await req.json();

    const { success, error, data } = await deletingNotifications(userId,notificationIds);
    if (!success || error) {
      return NextResponse.json(
        {
          success: false,
          message: "Falied to Delete notifications",
          error,
        },
        { status: 404 },
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "Successfully deleted notifications",
          data,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong.",
      },
      { status: 500 },
    );
  }
};
