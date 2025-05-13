import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // Get order status from query

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    // Check if the status is valid
    const validStatuses = ["pending", "processing", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Parse pagination query params
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");

    const limit = limitParam ? parseInt(limitParam) : 10; // default 10 items per page
    const page = pageParam ? parseInt(pageParam) : 1; // default to page 1

    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch orders from Supabase where order_status matches with pagination
    const { data, error, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("order_status", status)
      .range(from, to);

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.message,
        error,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully fetched orders",
        orders: data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: count ? Math.ceil(count / limit) : 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error },
      { status: 500 }
    );
  }
}
