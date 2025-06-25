import { NextResponse } from "next/server";
import { getNotificationLength } from "@/lib/notifications";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { success, error, data } = await getNotificationLength(userId);
    if (!success || error) {
      return NextResponse.json(
        {
          success: false,
          message: "Falied to get Notifications Length",
          error,
        },
        { status: 404 },
      );
    }
    

    return NextResponse.json(
      {
        success: true,
        message: "Success fully getting length of notifications",
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "SomeThing wents wronge",
        error,
      },
      { status: 500 },
    );
  }
};
