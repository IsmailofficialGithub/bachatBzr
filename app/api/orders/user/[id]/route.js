import { supabase } from "@/lib/supabaseSetup";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message: "User ID is required",
      },
      { status: 400 }
    );
  }

  try {
    // Fetch orders from Supabase for the given userId
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching orders:", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "Error fetching orders",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully fetched orders",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Something went wrong:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
