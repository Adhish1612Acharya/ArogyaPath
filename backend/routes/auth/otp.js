import express from "express";
import { isLoggedIn } from "../../middlewares/commonAuth.js";
import { sendOtpForContactVerification } from "../../controllers/auth/otpController.js";

const router = express.Router();

router.post("/send-otp-contact", isLoggedIn, sendOtpForContactVerification);

export default router;
