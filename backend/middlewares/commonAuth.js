export const isAlreadyLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    return res.status(400).json({
      message: "Already Logged In",
    });
  }
};

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(400).json({
      message: "not Logged In",
    });
  }
};
