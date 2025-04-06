import { applyDiscount } from "@/lib/discountHandler";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      user_id,
      product_ids,
      payment_method,
      transaction_id,
      voucher_code,
      delivery_address,
      phone,
      Receiver,
    } = await req.json();

    // ✅ Validate required fields
    if (
      !user_id ||
      !product_ids?.length ||
      !payment_method ||
      !delivery_address ||
      !phone ||
      !Receiver
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // ✅ Fetch product details from Supabase
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("_id, name, price,discounted_price")
      .in("_id", product_ids);

    if (productsError || !products) {
      return NextResponse.json(
        { error: "Error fetching products", details: productsError.message },
        { status: 500 },
      );
    }

    // ✅ Calculate total product price
    let totalPrice = 0;

    products.forEach((product) => {
      totalPrice += product.discounted_price
        ? applyDiscount(product.price, product.discounted_price)
        : product.price;
    });
    let discount = 0;
    let voucherDiscount = null;
    const shippingFee = 150 * product_ids.length;
    let codFee = 0;

    // ✅ Apply Voucher Discount (if applicable)
    if (voucher_code) {
      const { data: voucher, error: voucherError } = await supabase
        .from("vouchers")
        .select("discount_percentage")
        .eq("code", voucher_code)
        .single();

      if (!voucherError && voucher) {
        discount = (totalPrice * voucher.discount_percentage) / 100;
        voucherDiscount = voucher.discount_percentage;
        totalPrice -= discount;
      }
    }

    // ✅ Add Cash on Delivery Fee (PKR 50)
    if (payment_method === "cash_on_delivery") {
      codFee = 50;
    } else {
      // ✅ Validate transaction ID for non-COD payments
      if (!transaction_id) {
        return NextResponse.json(
          { error: "Transaction ID is required for non-COD payments" },
          { status: 400 },
        );
      }
    }

    // ✅ Final total amount calculation
    const totalAmount =
      Math.round((totalPrice + shippingFee + codFee) * 100) / 100;

    const { error } = await supabase
      .from("products")
      .update({ sold: true })
      .in("_id", product_ids);
    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Falied to Add Order",
          error: error.message,
        },
        { status: 500 },
      );
    }

    // ✅ Insert order into Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          Receiver,
          products,
          total_amount: {
            totalPrice: Math.round(totalPrice * 100) / 100,
            discount: discount ? Math.round(discount * 100) / 100 : undefined,
            voucher: voucherDiscount ? voucherDiscount : undefined,
            shipping_fee: shippingFee,
            cash_on_delivery_fee: codFee ? codFee : undefined,
            final_total: totalAmount,
          },
          order_status: "pending",
          payment_status:
            payment_method === "cash_on_delivery" ? "pending" : "paid",
          payment_method,
          transaction_id:
            payment_method !== "cash_on_delivery" ? transaction_id : null,
          delivery_address,
          phone,
          created_at: new Date(),
        },
      ])
      .select()
      .single();

    if (orderError) {
      await supabase
        .from("products")
        .update({ sold: false })
        .in("_id", product_ids);
      return NextResponse.json(
        { error: "Error creating order", details: orderError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message || error },
      { status: 500 },
    );
  }
}
