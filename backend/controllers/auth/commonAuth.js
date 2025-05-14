import Expert from "../../models/Expert/Expert.js";
import User from "../../models/User/User.js";
import crypto from "crypto";
import { sendResetEmail } from "../../utils/sendEmail.js";

export const setForgotPasswordToken = async (req, res) => {
  const { email, role } = req.body;

  let user = null;

  if (role === "user") {
    user = await User.findOne({ email });
  } else {
    user = await Expert.findOne({ email });
  }

  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 mins
  await user.save();

  const resetLink = `${process.env.VITE_API_URL}/${role}/reset-password/${token}`;

  const emailSubject = "Password Reset - ArogyaPath";

  const emailContent = `
        <h3>Reset Your Password</h3>
        <p>Click the link below to reset your password. This link is valid for 15 minutes:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, you can ignore this email.</p>
      `;

  await sendResetEmail(user.email, emailSubject, emailContent);

  res.json({ success: true, message: "Reset link sent to email" });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword, role } = req.body;

  let user = null;

  if (role === "user") {
    user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // still valid
    });
  } else {
    user = await Expert.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // still valid
    });
  }

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.setPassword(newPassword, async (err) => {
    if (err) return res.status(500).json({ message: "Error setting password" });

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  });
};

export default {
  setForgotPasswordToken,
  resetPassword,
};
