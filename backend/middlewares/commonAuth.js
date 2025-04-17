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
export const isExpert=(req,res,next)=>{
  if(req.user.role=="expert"){
   return next();
  }else{
    return res.status(400).json({
      message: "you have no authorization",
    });
  }
}
export const isUser=(req,res,next)=>{
  if(req.user.role=="user"){
   return next();
  }else{
    return res.status(400).json({
      message: "you have no authorization",
    });
  }
}

export default{
  isAlreadyLoggedIn,
  isLoggedIn,
  isUser,
  isExpert,
}