import User from "../../../models/User/User.js";
import Token from "../../../models/Token/Token.js";
import { sendEmailVerificationLink } from "../../../utils/sendEmailVerificationLink.js";
import crypto from "crypto";
import ExpressError from "../../../utils/expressError.js";

// Send verification email
export const sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ExpressError(400, "Invalid link");

    // Check if user is already verified
    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Create or update verification token
    let token = await Token.findOne({ userId: user._id, userType: "User" });
    if (!token) {
      token = await new Token({
        userType: "User",
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }).save();
    }

    // Generate verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${user._id}/${token.token}`;

    // Send verification email
    await sendEmailVerificationLink(
      user.email,
      verificationLink,
      user.profile.fullName
    );

    res.status(200).json({
      success: true,
      message: "Verification link sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending verification email",
      error: error.message,
    });
  }
};

// Verify email with token
export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ExpressError(400, "Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
      userType: "User",
    });

    if (!token) throw new ExpressError(400, "Invalid or expired token");

    // Check if token is expired
    if (token.expires < Date.now()) {
      await token.remove();
      throw new ExpressError(400, "Token expired");
    }

    // Update user verification status
    await User.findByIdAndUpdate(user._id, { verified: true });
    await token.remove();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  sendVerificationEmail,
  verifyEmail,
};
