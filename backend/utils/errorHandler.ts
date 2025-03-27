import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    const statusNumber = err.status || 500;
    const Msg = err.errMsg || "Internal server error";
    console.log(err);
    console.log(`${statusNumber} , ${Msg}`);
    res.status(statusNumber).json({
      success: false,
      status: 500,
      message: Msg,
    });
  } else {
    next();
  }
};

export default errorHandler;
