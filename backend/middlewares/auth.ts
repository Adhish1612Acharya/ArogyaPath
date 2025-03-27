import { NextFunction, Request, Response } from "express";

export const isAlreadyLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    return res.status(400).json({
      message: "Already Logged In",
    });
  }
};
