export const checkUserLogin=(req,res,next)=>{  
    if(req.isAuthenticated()){
  
      if(req.user.role==="user"){
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
  
  