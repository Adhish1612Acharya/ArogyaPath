// import { NextFunction, Request, Response } from "express";

// import expressError from "@/utils/expressError";
// import Student from "@/models/Student/Student";

// export const handleGoogleAuthError = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (err) {
//     console.error(`Error during Google authentication: ${err.message}`);
//     next(err);
//   }
// };

// export const handleGoogleCallback = (req: Request, res: Response) => {
//   res.redirect(`${process.env.VITE_API_URL}/u/solved/questions`);
// };

// export const handleGoogleAuthFailiure = (req: Request, res: Response) => {
//   res.redirect(`${process.env.VITE_API_URL}/login`);
// };

// export const googleCallBackFunction = async (
//   req: Request,
//   accessToken: any,
//   refreshToken: any,
//   profile: any,
//   done: any
// ) => {
//   try {
//     const user = await Student.findOne({ googleId: profile.id }).catch((err) =>
//       console.log("User Not Found ", err)
//     );
//     if (user) {
//       done(null, user);
//     } else {
//       const email =
//         profile.emails && profile.emails.length > 0
//           ? profile.emails[0].value
//           : null;
//       const username = profile.displayName;
//       const googleId = profile.id;
//       const profileImage = profile.picture;
//       const newUser = await Student.create({
//         username,
//         email,
//         googleId,
//         profileImage,
//       });
//       done(null, newUser);
//     }
//   } catch (err) {
//     console.log(err);
//     throw new expressError(500, "GoogleAuthError");
//   }
// };

// export default {
//   handleGoogleAuthError,
//   handleGoogleCallback,
//   handleGoogleAuthFailiure,
//   googleCallBackFunction,
// };
