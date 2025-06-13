import express from "express";
import emailVerificationController from "../../controllers/auth/user/emailVerification.js";
import wrapAsync from "../../utils/wrapAsync.js";
import { isLoggedIn } from "../../middlewares/commonAuth.js";

const router = express.Router();

// Route to send verification email
router.post(
  "/send-verification/:id",
  isLoggedIn,
  wrapAsync(emailVerificationController.sendVerificationEmail)
);

// Route to verify email with token
router.get(
  "/verify/:id/:token",
  wrapAsync(emailVerificationController.verifyEmail)
);

export default router;
