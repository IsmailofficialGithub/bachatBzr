import { CheckRouteRole } from "@/lib/auth-token";
import { supabaseAdmin } from "@/lib/supabaseSetup";
import { NextResponse } from "next/server";

export const POST = async (req) => {
   const {  success, error } = await CheckRouteRole(req,["admin"]);
   if (error || !success) {
      return NextResponse.json({ error }, { status: 401 })
    }
  try {
    const { userId, role } = await req.json();
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role: role })
      .eq("id", userId);

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
