import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/app/utils/sendMail";

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status, userId } = await req.json();
    // Fetch user email from database using userId
   
 console.log(status);
    if (!orderId || !status || !userId) {
      return NextResponse.json(
        {success:false, error: "Missing orderId or status or UserId" },
        { status: 400 },
      );
    }

    // Update Order Status in Database
    const {error} = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", orderId);
      
      
    if (error) {
      return NextResponse.json({success:false,message:"Falied to update status while database", error: error.message }, { status: 500 });
    }

    if (userId) {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (error) {
          console.error('Error fetching user:', error);
          return null;
      }
  const email=data?.user?.email;
      // Compose Email Content
      const emailSubject = "🚀 Important Update: Your Order Status Has Changed";

      const emailText = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-width: 150px;
          }
          .content {
            text-align: left;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
          }
          .social-icons a {
            margin: 0 10px;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
      
      <div class="container">
        <div class="logo">
          <img src="https://www.yourwebsite.com/logo.png" alt="Company Logo">
        </div>
        
        <div class="content">
          <p>Dear Valued Customer,</p>
          
          <p>We would like to inform you that the status of your order <strong>(#${orderId})</strong> has been updated to <strong>"${status}"</strong>.</p>
          
          <p>Please log in to your account to view more details about your order and track its progress.</p>
      
          <p>Thank you for choosing us for your shopping needs. <strong>We appreciate your business and look forward to serving you again.</strong></p>
      
          <p>For more updates and exclusive offers, please visit our website or follow us on social media:</p>
      
          <p>
            🌐 <strong>Website:</strong> <a href="https://www.yourwebsite.com">www.yourwebsite.com</a><br>
            📘 <strong>Facebook:</strong> <a href="https://www.facebook.com/yourpage">Facebook</a><br>
            🐦 <strong>Twitter:</strong> <a href="https://twitter.com/yourprofile">Twitter</a><br>
            📸 <strong>Instagram:</strong> <a href="https://www.instagram.com/yourprofile">Instagram</a>
          </p>
      
          <p>If you have any questions or require further assistance, <strong>Please do not hesitate to contact our customer support.</strong></p>
      
          <p><strong>Best regards,</strong><br>
          <strong>The SmartSwap Team</strong></p>
        </div>
      
        <div class="footer">
          &copy; 2024 SmartSwap. All rights reserved.
        </div>
      </div>
      
      </body>
      </html>
      `;
      
    
      
      // Send Email
      const emailResponse = await sendEmail(email, emailSubject, emailText);

      if (!emailResponse.success) {
        return NextResponse.json(
          { error: emailResponse.message },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated & email sent",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
