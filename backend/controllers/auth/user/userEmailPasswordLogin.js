import Token from "../../../models/Token/Token.js";
import User from "../../../models/User/User.js";
import ExpressError from "../../../utils/expressError.js";
import { sendEmailVerificationLink } from "../../../utils/sendEmailVerificationLink.js";

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
    const token = await new Token({
      userType: "User",
      userId: registeredUser._id,
      token: crypto.randomBytes(32).toString("hex"),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }).save();

    let emailError = null;
    try {
      await sendEmailVerificationLink(
        email,
        registeredUser._id,
        token._id,
        fullName
      );
    } catch (err) {
      console.error("Failed to send verification email:", err.message);
      emailError = err.message;
      // Optionally store this info in a DB/logs/queue
    }

    return res.status(200).json({
      success: true,
      message: emailError
        ? "Sign-up successful, but failed to send verification email."
        : "Sign-up successful. Verification email sent.",
      verificationEmailSent: emailError === null ? true : false,
      verified: false,
      userId: registeredUser._id,
    });
  } else {
    throw new ExpressError(400, error);
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
