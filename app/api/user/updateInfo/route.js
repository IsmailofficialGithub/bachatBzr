import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  try {
    const { _id, name, address } = await req.json();

    // Ensure address is in correct format
    if (address && typeof address !== "object") {
      return NextResponse.json(
        { error: "Address must be a valid JSON object." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({ name, address })
      .eq("auth_id", _id)
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Failed to update user info",
        error: error,
      });
    }

    return NextResponse.json({
      success: true,
      message: "User info updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};
