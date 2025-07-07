import AuthService from "../serivces/AuthSerivice";
import { Request,Response } from "express";
import jwt from "jsonwebtoken"
const authservice = new AuthService()

export const register = async (req: Request, res: Response):Promise<any> => {
  try {
    const { email, password, name } = req.body;
    const result = await authservice.register(email, password, name);
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: isProduction, 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      sameSite: isProduction ? 'strict' : 'lax', 
    });
    if (!isProduction) {
      console.log('Refresh token set in development:', result.refreshToken);
    }
    res.json({ token: result.token, user: result.user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};



export const login  = async (req:Request,res:Response):Promise<any>=>{
  try {
    const {email,password }= req.body
    const result = await authservice.login(email,password)
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", result.refreshToken,{
        httpOnly:true,
        secure:isProduction,
        maxAge:7*24*60*60*1000,
        sameSite:isProduction ? "strict" : "lax"
    })
      res.json({ token: result.token, user: result.user });
  } catch (error:any) {
    res.status(401).json({ message: error.message });
  }  
}

export const refresh = async (req:Request,res:Response):Promise<any> =>{
    try {
        const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({message : "No refresh token provided" });
    }
    const result = await authservice.refreshToken(refreshToken)
    res.json(result);
    } catch (error:any) {
    res.status(401).json({message:error.message})        
    }
}


export const logout = async (req: Request, res: Response):Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'No refresh token provided' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as { id: string };
    await authservice.logout(decoded.id);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};