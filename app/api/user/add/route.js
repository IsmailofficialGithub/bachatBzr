import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { phone, email } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Some fields are missing",
        },
        { status: 400 }
      );
    }

    const response = await supabase
      .from("users")
      .insert([{ phone, email }])
      .select(); // Optional: returns the inserted user

    if (response.error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add user",
          error: response.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User added successfully",
        data: response.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error adding user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
};
