
import { LoginResponseDTO, RegisterInitResponseDto } from "@/Dto/responseDto";
import { Role } from "@/types/role.types";
import { Types } from "mongoose";
import {LoginRequestDto}from "@/Dto/requestDto"
import { IUser } from "@/models/User.model";
export interface IAuthService {
  login(loginDto:LoginRequestDto): Promise<LoginResponseDTO>;

  registerInit(params: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }): Promise<RegisterInitResponseDto >;

  registerVerify(
    email: string,
    otp: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; name: string; role: string };
  }>;


getCurrentUser(token: string): Promise<IUser>;
  refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string,refreshToken :string }>;


  loginWithGoogle(
    googleToken: string,
    role: Role
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; name: string; role: string };
  }>;

  resendOtp(email:string):Promise<RegisterInitResponseDto>
  forgotPassword(email:string):Promise<{ message: string }>
  resetPassword (token:string , newPassword:string):Promise<{ message: string }>
}

