import express from "express";
import passport from "passport";
import  emailPasswordExpertAuthController  from "../../controllers/auth/expert/emailPasswordLogin.js";
import  emailPasswordUserAuthController  from "../../controllers/auth/user/emailpasswordAuth.js";
import wrapAsync from "../../utils/wrapAsync.js";
import { isAlreadyLoggedIn } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/failureLogin", emailPasswordExpertAuthController.failureLogin);

router.get("/logout",
     emailPasswordExpertAuthController.logout);

router.post(
  "/signUp",
//   isAlreadyLoggedIn,
//   checkSignUpForm,
  wrapAsync(   emailPasswordExpertAuthController.signUp)
);

router.post(
  "/login",
  isAlreadyLoggedIn,
  passport.authenticate("student", {
    failureRedirect: "/api/auth/failureLogin",
  }),
  authController.login
);

router.get("/check",  isAlreadyLoggedIn, emailPasswordExpertAuthController.login);

router.put(
  "/complete-profile",
  isAuthenticated,
  checkCompleteProfileForm,
  wrapAsync(authController.completeProfile)
);

export default router;
