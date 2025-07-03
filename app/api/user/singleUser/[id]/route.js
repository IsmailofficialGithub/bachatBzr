import { CheckRouteRole } from "@/lib/auth-token";
import { supabaseAdmin } from "@/lib/supabaseSetup";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const {  success, error } = await CheckRouteRole(req,["admin"]);
 if (error || !success) {
    return NextResponse.json({ error }, { status: 401 })
  }
  try {
    const userId = await params.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch all users (since Supabase doesn't allow direct user lookup by ID)
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error while getting data from database",
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Find the user by ID
    const user = data.users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Successfully get users details", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
