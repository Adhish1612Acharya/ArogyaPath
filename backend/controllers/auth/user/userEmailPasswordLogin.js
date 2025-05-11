import User from "../../../models/User/User.js";
import crypto from "crypto";
import { sendResetEmail } from "../../../utils/sendEmail.js";

export const signUp = async (req, res) => {
  let signUpError = false;
  let error = "";
  const { username, email, password } = req.body;

  const newExpert = new User({
    username,
    email,
  });

  const registeredExpert = await User.register(newExpert, password).catch(
    (err) => {
      console.log("signUpError");
      console.log(err);
      signUpError = true;
      error = err.message;
    }
  );

  if (!signUpError && registeredExpert) {
    req.login(registeredExpert, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: err.message,
          success: false,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "successSignUp",
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const login = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "successLogin",
  });
};

export const failureLogin = async (req, res) => {
  res.status(401).json({
    success: false,
    message: "failureLogin",
  });
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "successLogOut",
      });
    }
  });
};

export const setForgotPasswordToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 mins
  await user.save();

  const resetLink = `${process.env.VITE_API_URL}/reset-password/${token}`;

  await sendResetEmail(user.email, resetLink);

  res.json({ message: "Reset link sent to email" });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // still valid
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.setPassword(newPassword, async (err) => {
    if (err) return res.status(500).json({ message: "Error setting password" });

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  });
};

export default {
  signUp,
  login,
  failureLogin,
  logout,
  setForgotPasswordToken,
  resetPassword,
};
