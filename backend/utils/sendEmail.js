import nodemailer from "nodemailer";

export const sendResetEmail = async (toEmail, resetLink) => {
  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can use Mailgun, SendGrid, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: `"ArogyaPath" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Password Reset - ArogyaPath",
      html: `
        <h3>Reset Your Password</h3>
        <p>Click the link below to reset your password. This link is valid for 15 minutes:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send reset email:", error);
    throw new Error("Could not send reset email");
  }
};
