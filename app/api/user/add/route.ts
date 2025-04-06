import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { phone, email } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Some filled are missing",
        },
        { status: 400 },
      );
    }
    const response = await supabase.from("users").insert([{ phone, email }]);
    if (response.error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add user",
          error: response.error,
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "User added successfully",
          data: response.data,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error,
      },
      { status: 500 },
    );
  }
};
