import { NextFunction, Request, Response } from "express";
import { User } from "../../types/UserType";

export const checkExpertLogin=(req:Request,res:Response,next:NextFunction)=>{  
  if(req.isAuthenticated()){

    if(req.user.role==="expert"){
        next()
  }else{
    res.status(403).json({
        success:false,
        message:"notLoggedIn"
    })
  }
} 
}