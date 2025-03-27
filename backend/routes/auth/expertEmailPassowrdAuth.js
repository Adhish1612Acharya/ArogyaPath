import express from "express";
import passport from "passport";
import  emailPasswordExpertAuthController  from "../../controllers/auth/expert/emailPasswordLogin.js";
import wrapAsync from "../../utils/wrapAsync.js";

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
  // isAlreadyLoggedIn,
  passport.authenticate("student", {
    failureRedirect: "/api/auth/failureLogin",
  }),
  emailPasswordExpertAuthController.login
);

router.get("/check",   emailPasswordExpertAuthController.login);

router.put(
  "/complete-profile",
  // isAuthenticated,
  // checkCompleteProfileForm,
  wrapAsync( emailPasswordExpertAuthController.completeProfile)
);

export default router;
