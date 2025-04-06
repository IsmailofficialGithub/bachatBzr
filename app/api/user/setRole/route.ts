import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { userId, role } = await req.json();
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        app_metadata: { role },
        user_metadata: { role }, // Correct syntax
      },
    );

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Failed to update Role",
        error: error,
      });
    }
    return NextResponse.json({
      success: true,
      message: "Successfully update user role",
      data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "SomeThing wents wrong",
      error: error,
    });
  }
};
