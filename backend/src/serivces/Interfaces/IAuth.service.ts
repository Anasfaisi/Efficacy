import { LoginResponseDTO } from "@/Dto/login.dto";
import { Types } from "mongoose";
export interface IAuthService {
  login(
    email: string,
    password: string,
    role: "admin" | "user" | "mentor"
  ): Promise<LoginResponseDTO>;

  registerInit(params: {
    email: string;
    password: string;
    name: string;
    role: "mentor" | "user";
  }): Promise<{ tempUserId: string; email: string }>;

  registerVerify(
    email: string,
    otp: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; name: string; role: string };
  }>;

  registerUser(params: {
    email: string;
    password: string;
    name: string;
    role: "mentor" | "user";
  }): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; name: string; role: string };
  }>;

  refreshToken(
    refreshToken: string,
    role: "admin" | "user"
  ): Promise<{ accessToken: string }>;

  logout(refreshToken: string): Promise<void>;

  loginWithGoogle(
    googleToken: string,
    role: "user" | "mentor"
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; name: string; role: string };
  }>;
}
