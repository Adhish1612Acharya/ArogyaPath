export const checkExpertLogin=(req,res,next)=>{  
  if(req.isAuthenticated()){

    if(req.user.role==="expert"){
        next()
  }else{
    res.status(403).json({
        success:false,
        message:"notLoggedIn"
    })
  }
} else{
  res.status(403).json({
      success:false,
      message:"notLoggedIn"
  })
}
}

