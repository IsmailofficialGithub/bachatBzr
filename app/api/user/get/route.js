import { supabaseAdmin } from "@/lib/supabaseSetup";
import { NextResponse } from "next/server";
import { CheckRouteRole } from "@/lib/auth-token";

export async function GET(req) {
const {  success, error } = await CheckRouteRole(req,["admin"]);
 if (error || !success) {
    return NextResponse.json({ error }, { status: 401 })
  }

  try {
    // Extract query parameters (page & pageSize)
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // Validate pagination input
    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid pagination values" },
        { status: 400 }
      );
    }

    // Fetch all users to calculate total count (Supabase does not provide a count directly)
    const { data: allUsers, error: countError } =
      await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 10000, // Large number to get all users
      });

    if (countError) {
      return NextResponse.json(
        { success: false, message: "Failed to count users" },
        { status: 500 }
      );
    }

    const totalUsers = allUsers.users.length;
    const totalPages = Math.ceil(totalUsers / pageSize);

    // Fetch paginated users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: pageSize,
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to get Users from database",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully getting users",
      users: data.users,
      pagination: {
        page,
        pageSize,
        totalUsers,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error },
      { status: 500 }
    );
  }
}
