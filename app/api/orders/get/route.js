import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseSetup";
import { CheckRouteRole } from "@/lib/auth-token";

export async function GET(req) {
  const {  success, error } = await CheckRouteRole(req,["admin"]);
 if (error || !success) {
    return NextResponse.json({ error }, { status: 401 })
  }
  try {
    // ✅ Parse query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1; // Default page 1
    const limit = Number(searchParams.get("limit")) || 10; // Default 10 orders per page
    const offset = (page - 1) * limit;

    // ✅ Fetch total order count (for pagination)
    const { count, error: countError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json(
        {
          success: false,
          message: "SomeThing wents wrong while fetching total orders",
          error: countError,
        },
        { status: 500 }
      );
    }

    // ✅ Fetch paginated orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*") // No joins since products are stored in JSONB
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (ordersError) {
      return NextResponse.json(
        {
          success: false,
          message: "SomeThing wents wrong while fetching paginated orders",
          error: countError,
        },
        { status: 500 }
      );
    }

    // ✅ Process each order to fetch product details
    for (const order of orders) {
      if (order.products) {
        const productIds = order.products.map((p) => p._id); // Extract product IDs
        const { data: products, error: productError } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);

        if (!productError) {
          order.products = products; // Replace product IDs with full product details
        }
      }
    }

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        totalOrders: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message || error },
      { status: 500 }
    );
  }
}
