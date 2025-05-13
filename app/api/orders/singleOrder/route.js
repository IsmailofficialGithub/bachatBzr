import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Adjust the import path as necessary

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  // ✅ Check if orderId is provided
  if (!orderId) {
    return NextResponse.json(
      { success: false, message: "Missing orderId parameter" },
      { status: 400 }
    );
  }

  try {
    // ✅ Fetch order from Supabase
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch order details from database",
          error,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Fetch product details for each product in the order
    const productDetails = [];

    for (const item of data.products) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("_id", item._id)
        .single();

      if (productError) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to fetch product details from database",
            error: productError.message,
          },
          { status: 500 }
        );
      }

      productDetails.push(product);
    }

    // ✅ Attach full product details to response
    data.productsDetails = productDetails;

    return NextResponse.json(
      {
        success: true,
        message: "Successfully fetched order data",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
