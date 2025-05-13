import express from "express";
import { isAlreadyLoggedIn } from "../../middlewares/commonAuth.js";
import {
  validateForgotPassword,
  validateResetPassword,
} from "../../middlewares/validationMiddleware/validationMiddlewares.js";
import wrapAsync from "../../utils/wrapAsync.js";
import commonAuthController from "../../controllers/auth/commonAuth.js";

const router = express.Router();

router.get("/check", (req, res) => {
  const loggedIn = req.isAuthenticated();
  const userRole = req.user?.role || null;

  console.log("LoggedIn : ", loggedIn);

  res.status(200).json({
    success: true,
    message: "Auth Status",
    loggedIn,
    userRole,
  });
});

router.post(
  "/forgot-password",
  isAlreadyLoggedIn,
  validateForgotPassword,
  wrapAsync(commonAuthController.setForgotPasswordToken)
);

router.post(
  "/reset-password",
  isAlreadyLoggedIn,
  validateResetPassword,
  wrapAsync(commonAuthController.resetPassword)
);

export default router;
