import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseSetup";

export async function GET() {
  try {
    // Fetch 12 random products using PostgreSQL's RANDOM()
    const { data, error } = await supabase.rpc("get_random_products");

    // Handle Supabase errors
    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch random products",
          error,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Random products retrieved successfully.",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching random products:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
