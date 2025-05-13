import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const offset = (page - 1) * limit;

    // Fetch all users from Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to get data from database",
          error: error.message,
        },
        { status: 500 }
      );
    }

    let users = data.users || [];

    // Filter by role if specified
    if (role && (role === "admin" || role === "user")) {
      users = users.filter((user) => user?.user_metadata?.role === role);
    }

    // Apply pagination manually
    const totalUsers = users.length;
    const paginatedUsers = users.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      message: "Successfully getting data",
      users: paginatedUsers,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error,
      },
      { status: 500 }
    );
  }
}
