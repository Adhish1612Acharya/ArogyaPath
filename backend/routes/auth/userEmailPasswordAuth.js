import express from "express";
import passport from "passport";
import emailPasswordUserAuthController from "../../controllers/auth/user/userEmailPasswordLogin.js";
import wrapAsync from "../../utils/wrapAsync.js";
import { isAlreadyLoggedIn } from "../../middlewares/commonAuth.js";

const router = express.Router();

router.get("/failureLogin", emailPasswordUserAuthController.failureLogin);

router.post(
  "/signUp",
  isAlreadyLoggedIn,
  // checkSignUpForm,
  wrapAsync(emailPasswordUserAuthController.signUp)
);

router.post(
  "/login",
  isAlreadyLoggedIn,
  passport.authenticate("user", {
    failureRedirect: "/api/auth/user/failureLogin",
  }),
  emailPasswordUserAuthController.login
);

router.get("/check", isAlreadyLoggedIn, emailPasswordUserAuthController.login);



export default router;
