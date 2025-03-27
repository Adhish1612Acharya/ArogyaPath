import express from "express";
import passport from "passport";
import emailPasswordUserAuthController from "../../controllers/auth/user/emailpasswordAuth.js";
import wrapAsync from "../../utils/wrapAsync.js";
import { isAlreadyLoggedIn } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/failureLogin", emailPasswordUserAuthController.failureLogin);

router.get("/logout", emailPasswordUserAuthController.logout);

router.post(
  "/signUp",
  //   isAlreadyLoggedIn,
  //   checkSignUpForm,
  wrapAsync(emailPasswordUserAuthController.signUp)
);

router.post(
  "/login",
//   isAlreadyLoggedIn,
  passport.authenticate("student", {
    failureRedirect: "/api/auth/failureLogin",
  }),
  authController.login
);

router.get("/check",
    //  isAlreadyLoggedIn, 
     emailPasswordUserAuthController.login);

// router.put(
//   "/complete-profile",
//   isAuthenticated,
//   checkCompleteProfileForm,
//   wrapAsync(authController.completeProfile)
// );

export default router;
