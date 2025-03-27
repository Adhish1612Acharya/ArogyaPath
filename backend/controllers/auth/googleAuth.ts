import { NextFunction, Request, Response } from "express";
import Expert from "../../models/Expert/Expert";
import expressError from "../../utils/expressError";
import User from "../../models/User/User";

export const handleGoogleAuthError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    console.error(`Error during Google authentication: ${err.message}`);
    next(err);
  }
};

export const handleGoogleCallback = (req: Request, res: Response) => {
  res.redirect(`${process.env.VITE_API_URL}/posts`);
};

export const handleGoogleAuthFailiure = (req: Request, res: Response) => {
  res.redirect(`${process.env.VITE_API_URL}/auth`);
};

export const googleCallBackFunctionForExpert = async (
  req: Request,
  accessToken: any,
  refreshToken: any,
  profile: any,
  done: any
) => {
  try {
    const user = await Expert.findOne({ googleId: profile.id }).catch((err) =>
      console.log("User Not Found ", err)
    );
    if (user) {
      done(null, user);
    } else {
      const email =
        profile.emails && profile.emails.length > 0
          ? profile.emails[0].value
          : null;
      const username = profile.displayName;
      const googleId = profile.id;
      const profileImage = profile.picture;
      const newUser = await Expert.create({
        username,
        email,
        googleId,
        profile: {
          profileImage: profileImage,
          fullname: profile.displayName,
        },
      });
      done(null, newUser);
    }
  } catch (err) {
    console.log(err);
    throw new expressError(500, "GoogleAuthError");
  }
};

export const googleCallBackFunctionForUser = async (
  req: Request,
  accessToken: any,
  refreshToken: any,
  profile: any,
  done: any
) => {
  try {
    const user = await User.findOne({ googleId: profile.id }).catch((err) =>
      console.log("User Not Found ", err)
    );
    if (user) {
      done(null, user);
    } else {
      const email =
        profile.emails && profile.emails.length > 0
          ? profile.emails[0].value
          : null;
      const username = profile.displayName;
      const googleId = profile.id;
      const profileImage = profile.picture;
      const newUser = await User.create({
        username,
        email,
        googleId,
        profile: {
          profileImage: profileImage,
          fullname: profile.displayName,
          age: 0,
          contact: -1,
        },
      });
      done(null, newUser);
    }
  } catch (err) {
    console.log(err);
    throw new expressError(500, "GoogleAuthError");
  }
};

export default {
  handleGoogleAuthError,
  handleGoogleCallback,
  handleGoogleAuthFailiure,
  googleCallBackFunctionForExpert,
  googleCallBackFunctionForUser,
};
