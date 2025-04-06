import nodemailer from "nodemailer";
// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Mailgun, SendGrid, etc.
  auth: {
    user: process.env.NODEMAILER_EMAIL, // Your email address
    pass: process.env.NODEMAILER_PASSWORD, // Your email password or app password
  },
});

// Function to send email
export async function sendEmail(to: string, subject: string, emailHtml: string) {
  const mailOptions = {
    from: process.env.Email_to_send_Message,
    to,
    subject,
    html:emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
}
