import Token from "../../../models/Token/Token.js";
import User from "../../../models/User/User.js";
import { sendEmail } from "../../../utils/sendEmail.js";

export const signUp = async (req, res) => {
  let signUpError = false;
  let error = "";
  const { fullName, email, password } = req.body;

  const newExpert = new User({
    username: fullName,
    email,
    profile: {
      fullName: fullName,
    },
  });

  const registeredUser = await User.register(newExpert, password).catch(
    (err) => {
      console.log("signUpError");
      console.log(err);
      signUpError = true;
      error = err.message;
    }
  );
  if (!signUpError && registeredUser) {
    // Create verification token
    let token = await new Token({
      userType: "User",
      userId: registeredUser._id,
      token: crypto.randomBytes(32).toString("hex"),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }).save();

    // Generate and send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${registeredUser._id}/${token.token}`;
    await sendEmailVerificationLink(email, verificationLink, fullName);

    // Login user after signup
    req.login(registeredUser, (err) => {
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
          verified: false,
          userId: registeredUser._id,
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

export default {
  signUp,
  login,
  failureLogin,
};
