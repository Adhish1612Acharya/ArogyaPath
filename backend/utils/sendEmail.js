import nodemailer from "nodemailer";

export const sendEmail = async (toEmail, subject, emailBody, attachments) => {
  try {
    console.log("To eamil :", toEmail);
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: `"ArogyaPath" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: emailBody,
      attachments: attachments || [],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
