import bcrypt from "bcrypt"
import UserRepository from "../repositories/UserRepository"
import jwt from "jsonwebtoken"
import { IUser } from "../models/User"

class AuthService {
    private userRepository: UserRepository
    constructor(){
        this.userRepository = new UserRepository();
    }

  async register (email:string,password:string,name:string):Promise<{token:string;refreshToken: string,user:{email:string,name:string}}>{
    const existingUser = await this.userRepository.findByEmail(email);
    if(existingUser){
        throw new Error("User already exist")
    }
    const hashPassword = await bcrypt.hash(password,10)
    const user = await this.userRepository.create({name,email,password:hashPassword})
    const token = await this.generateAccessToken(user)
 const refreshToken = this.generateRefreshToken(user);
    await this.userRepository.updateRefreshToken(user._id!.toString(), refreshToken);
    return {token, refreshToken, user:{email:user.email,name:user.name}}
  }


    async login(email: string, password: string): Promise<{ token: string;refreshToken: string, user: { email: string; name: string } }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials'); 
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    const token = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    await this.userRepository.updateRefreshToken(user._id!.toString(), refreshToken);
    return { token,refreshToken, user: { email: user.email, name: user.name } };
  }

  async refreshToken(refreshToken:string):Promise<{token : string;user :{email:string,name:string}}>{
    try{
    const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET || 'refreshSecret') as {id:string ;email:string};
    const user = await this.userRepository.findByRefreshToken(refreshToken);
    if(!user || user._id!.toString() !== decoded.id){
        throw new Error("Invalid refresh token")
    }
    const newAccessToken = this.generateAccessToken(user);
    return {token:newAccessToken,user:{email:user.email,name:user.name}};
   }catch(error){
    throw new Error("Invalid refresh Token")
   } 
  }

    private generateAccessToken(user:IUser):string{
        return jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET || "secret",{expiresIn:"1h"})
    }
    private generateRefreshToken(user:IUser):string{
        return jwt.sign({id:user._id,email:user.email},process.env.JWT_REFRESH_SECRET || "refreshSecret",{
            expiresIn:"7d"
        })
    }
    async logout (userId:string):Promise<void>{
        await this.userRepository.updateRefreshToken(userId,null)
    }
}

export default AuthService