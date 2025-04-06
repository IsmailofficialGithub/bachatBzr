import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination values" },
        { status: 400 },
      );
    }

    // Fetch all users from Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 10000, // Fetch all users to filter
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to get Data from database",
          error: error.message,
        },
        { status: 500 },
      );
    }

    // Filter users by email or phone number
    const filteredUsers = data.users.filter(
      (user) =>
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        (user.phone && user.phone.includes(query)),
    );

    // Paginate results
    const startIdx = (page - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(startIdx, startIdx + pageSize);

    return NextResponse.json({
      success: true,
      message: "SuccessFully getting users details",
      users: paginatedUsers,
      Pagination: {
        totalUsers: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / pageSize),
        currentPage: page,
      },
    });
  } catch (error) {
    return NextResponse.json({success:false,message:"SomeThing wents wrong", error: error }, { status: 500 });
  }
}
