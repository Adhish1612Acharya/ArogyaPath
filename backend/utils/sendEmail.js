import nodemailer from "nodemailer";
import ExpressError from "../utils/expressError.js";

// export const sendEmail = async (toEmail, subject, emailBody, attachments) => {
//   try {
//     // Configure transporter
//     const transporter = nodemailer.createTransport({
//       service: "Gmail", // You can use Mailgun, SendGrid, etc.
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Define email options
//     const mailOptions = {
//       from: `"ArogyaPath" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: subject,
//       html: emailBody,
//       attachments: attachments || [],
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.messageId);
//   } catch (error) {
//     console.error("Failed to send reset email:", error);
//     throw new ExpressError("Could not send reset email");
//   }
// };
  
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
    throw new ExpressError("Could not send email", 500);
  }
};
