import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

interface AuthRequest extends Request{
    user?: {id:string;email:string}
}

export const authMiddleware = (req:AuthRequest,res:Response,next:NextFunction)=>{
    const token = req.header("Authorization")?.replace("Bearer","");
    if(!token){
        return res.status(401).json({message:"no token provided"})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET || "secret")as {id:string;email:string};
        req.user = decoded;
        next();
    }catch(error){
        res.status(401).json({message:"invalid token"})
    }
}