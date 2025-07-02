import ExpressError from "../../utils/expressError.js";
import { sendEmail } from "../../utils/sendEmail.js";

export const sendOtpForContactVerification = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw new ExpressError(401, "User not found");

    // Check if contact is already verified
    if (user.verifications?.contactNo) {
      throw new ExpressError(400, "Contact number already verified");
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in session (for demo)
    req.session.otp = otp;
    req.session.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Send OTP to user's email (for now)
    await sendEmail(
      user.email,
      "Your OTP for Contact Verification",
      `<p>Your OTP is: <b>${otp}</b></p>`
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your email for contact verification",
    });
  } catch (err) {
    next(err);
  }
};
