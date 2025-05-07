export const checkExpertLogin = (req, res, next) => {
  console.log("Post middleware called");
  console.log("User role : ", req.user);
  if (req.isAuthenticated()) {
    if (req.user.role === "expert") {
      console.log("Next middleware called");
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "notAuthorized",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "notAuthenticated",
    });
  }
};
