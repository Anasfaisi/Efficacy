import { Request, Response } from "express";
import { AuthService } from "../serivces/auth.service";
import { ValidationService } from "../serivces/validation.service";
import { TYPES } from "@/types";
import { inject } from "inversify";
import { OtpService } from "@/serivces/otp.service";
import { CodeChallengeMethod } from "google-auth-library";
import code from "@/types/http-status.enum";
import { BADFAMILY } from "dns";
import { LoginRequestDto } from "@/Dto/login.dto";

export class UserController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,

  ) {}

  async login(req: Request, res: Response) {
    try {
      const dto = new LoginRequestDto(
        req.body.email,
        req.body.password,
        req.body.role
      );

      const responseDto = await this.authService.login(
        dto.email,
        dto.password,
        dto.role as "admin" | "user" | "mentor"
      );

      res.cookie("refreshToken", responseDto.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.status(code.OK).json(responseDto.toJSON());
    } catch (error: any) {
      res.status(code.UNAUTHORIZED).json({ message: error.message });
    }
  }

  async registerInit(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      await this.authService.registerInit({ email, password, name, role });
      res.status(code.OK).json({ message: "OTP sent to email" });
    } catch (error: any) {
      res.status(code.BAD_REQUEST).json({ message: error.message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      const result = await this.authService.registerUser({
        email,
        password,
        name,
        role,
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res
        .status(code.OK)
        .json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      res.status(code.BAD_REQUEST).json({ message: error.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { role } = req.body;
      if (!refreshToken || !["admin", "user"].includes(role)) {
        throw new Error("Invalid refresh token or role");
      }
      const result = await this.authService.refreshToken(
        refreshToken,
        role as "admin" | "user"
      );
      res.json({ accessToken: result.accessToken });
    } catch (error: any) {
      res.status(code.UNAUTHORIZED).json({ message: error.message });
    }
  }

  async googleAuth(req: Request, res: Response) {
    try {
      const { googleToken, role } = req.body;
     
      const result = await this.authService.loginWithGoogle(googleToken, role);
      console.log("Google login result:", result);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res
        .status(code.OK)
        .json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      console.error(error);
      res.status(code.UNAUTHORIZED).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      console.log("at the logout route", );
      const {refreshToken} = req.cookies;
      console.log(refreshToken,"refefef")
      if (!refreshToken) {
        throw new Error("Invalid refresh token or no refresh token");
      }
      const result= await this.authService.logout(refreshToken);
      console.log(result)
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      console.log("hai")
      res.status(code.OK).json({ message: "Logged out successfully" });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(code.INTERNAL_SERVER_ERROR).json({ message: "Logout failed" });
    }
  }
}
