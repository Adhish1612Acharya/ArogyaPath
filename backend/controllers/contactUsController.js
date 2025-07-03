import { sendEmail } from "../utils/sendEmail.js";

// Controller to handle Contact Us form submissions
const sendContactUsEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const subject = `Contact Us Form Submission from ${name}`;
    const html = `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`;
    await sendEmail({
      to: process.env.CONTACT_US_EMAIL || "teamparakram16@gmail.com",
      subject,
      html,
    });
    res
      .status(200)
      .json({ message: "Your message has been sent successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
};

export default sendContactUsEmail;
