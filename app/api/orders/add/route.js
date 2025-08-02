import { sendEmail } from "@/app/utils/sendMail";
import { applyDiscount } from "@/lib/discountHandler";
import { supabase } from "@/lib/supabaseSetup";
import { NextResponse } from "next/server";
import { OrderCreateHTML } from "@/app/utils/emailData/orderCreated/email";
import { createNotification } from "@/lib/notifications";
import { NewOrdertoAdmin } from "@/app/utils/emailData/orderCreated/newOrder";

export async function POST(req) {
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
      // !user_id ||
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
      codFee = 0;
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
      // .update({ sold: true })
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

    if (order) {
      const orderId = order.id;
      const productsDetailForEmail = order.products.map((p) => ({
        name: p.name,
        price: p.price,
        discounted_price: p.discounted_price,
      }));
      const totalPriceForEmail = order.total_amount.final_total;
      const emailHtml = OrderCreateHTML(
        orderId,
        productsDetailForEmail,
        totalPriceForEmail,
      );
      const NewOrdertoAdminHtml = NewOrdertoAdmin(
        orderId,
        productsDetailForEmail,
        totalPriceForEmail,
      );
      const emailSubject = "Order Confirmation - Thank You for Your Purchase!";
      const notificationData = {
        user_id: [
          "41d9c72d-259a-4fb1-b488-c2cd216e19ce",
          "d4550143-6146-486e-b9a6-0796f90592eb",
          "d3e0d405-09c4-44fb-933a-3fbc0945580d",
        ],
        title: "! New Order !",
        message: `New Order has been created , Check it out . ORDERID is ${orderId}`,
        type: "order created",
      };
      await createNotification(notificationData);
      await sendEmail(delivery_address.email, emailSubject, emailHtml);
      await sendEmail(
        process.env.AdminEamil,
        "New order is created",
        NewOrdertoAdminHtml,
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
