import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import googleAuthController from   "../../controllers/auth/googleAuth";

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "default-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "default-client-secret",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `${process.env.SERVER_URL}/api/auth/google/user/callback`,
      passReqToCallback: true,
    },
    googleAuthController.googleCallBackFunctionForUser
  )
);

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  googleAuthController.handleGoogleAuthError
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/user/failureLogin",
  }),
  googleAuthController.handleGoogleCallback
);

router.get("/failureLogin", googleAuthController.handleGoogleAuthFailiure);



export default router;
