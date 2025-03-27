import { Request, NextFunction, Response } from "express";

const wrapAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default wrapAsync;
