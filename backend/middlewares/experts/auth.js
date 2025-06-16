import ExpressError from "../../utils/expressError.js";

export const checkExpertLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new ExpressError("Authentication required", 401);
  }
  if (req.user.role !== "expert") {
    throw new ExpressError("Expert authorization required", 403);
  }
  next();
};

