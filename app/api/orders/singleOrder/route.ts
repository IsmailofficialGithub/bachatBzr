import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Adjust the import path as necessary

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  // checking orderId is avaliable
  if (!orderId) {
    return NextResponse.json(
      { success: false, message: "Missing orderId parameter" },
      { status: 400 },
    );
  }
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Falied to fetch orderDetails from database",
          error,
        },
        { status: 500 },
      );
    }
    if (!data) {
      return NextResponse.json(
        { success: false, message: "Order not found", error },
        { status: 404 },
      );
    }

    // Create an array to store product details
    const productDetails = [];

    // Loop through each product in the array
    for (const item of data.products) {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("_id", item._id)
        .single();
        console.log(products,error)

      if (error) {
        return NextResponse.json(
          {
            success: false,
            message: "Falied to fetch productDetails from database",
            error: error.message,
          },
          { status: 500 },
        );
      }
      productDetails.push(products);
      // add product details in data.productsDetails
    }
    data.productsDetails = productDetails;
    return NextResponse.json(
      { success: true, message: "SuccessFully data is fetched...", data },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
