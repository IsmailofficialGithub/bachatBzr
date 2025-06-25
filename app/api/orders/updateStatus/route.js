import { supabase, supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/app/utils/sendMail";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";

export async function PATCH(req) {
  try {
    const { orderId, status, userId } = await req.json();

    if (!orderId || !status || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or status or userId" },
        { status: 400 }
      );
    }

    // ✅ Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update status in database",
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    // ✅ Fetch user email
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch user", error: userError },
        { status: 500 }
      );
    }

    const email = userData?.user?.email;

    // ✅ Compose email content
    const emailSubject = "🚀 Important Update: Your Order Status Has Changed";
    const emailText = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .logo { text-align: center; margin-bottom: 20px; }
          .logo img { max-width: 150px; }
          .content { text-align: left; }
          .footer { margin-top: 20px; text-align: center; font-size: 14px; color: #777; }
          .social-icons a { margin: 0 10px; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://res.cloudinary.com/dzkoeyx3s/image/upload/v1750419010/Bachat_2_tap7mv.png" alt="Company Logo">
          </div>
          <div class="content">
            <p>Dear Valued Customer,</p>
            <p>Your order <strong>(#${orderId})</strong> status has been updated to <strong>"${status}"</strong>.</p>
            <p>Please log in to view your order and track its progress.</p>
            <p>Thank you for choosing SmartSwap!</p>
            <p>
              🌐 <strong>Website:</strong> <a href="https://www.yourwebsite.com">www.yourwebsite.com</a><br>
              📘 <strong>Facebook:</strong> <a href="https://www.facebook.com/yourpage">Facebook</a><br>
              🐦 <strong>Twitter:</strong> <a href="https://twitter.com/yourprofile">Twitter</a><br>
              📸 <strong>Instagram:</strong> <a href="https://www.instagram.com/yourprofile">Instagram</a>
            </p>
            <p><strong>Best regards,</strong><br>The SmartSwap Team</p>
          </div>
          <div class="footer">&copy; 2025 to 2030 BachatBzr. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    // ✅ Send email
    const emailResponse = await sendEmail(email, emailSubject, emailText);

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    const notificationdata = {
      user_id: userId,
      order_id: orderId,
      type: status,
      title: "Important Update: Your Order Status Has Changed",
      message: `Your order (#${orderId}) status has been updated to "${status}". Track your order for more details.`,
    }
    await createNotification(notificationdata)

    return NextResponse.json({
      success: true,
      message: "Order status updated & email sent",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
