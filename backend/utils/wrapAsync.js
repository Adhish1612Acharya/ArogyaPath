import { Request, NextFunction, Response } from "express";

const wrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default wrapAsync;
