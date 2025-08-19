import { Request, Response } from "express";
import { AuthService } from "../serivces/auth.service";
import { TYPES } from "@/types";
import { inject } from "inversify";
import code from "@/types/http-status.enum";
import { LoginRequestDto } from "@/Dto/login.dto";
import { OtpVerificationRequestDto, RegisterRequestDto, resendOtpRequestDto } from "@/Dto/register.dto";
import { ForgotPasswordRequestDto, ResetPasswordrequestDto } from "@/Dto/forgotpassword.dto";
import "@/config/env.config";
import { IAuthService } from "@/serivces/Interfaces/IAuth.service";


export class UserController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,

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
      const dto = new RegisterRequestDto(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.role,
      )
      const result = await this.authService.registerInit({
        name: dto.name,
        email: dto.email,
        password: dto.password,
        role: dto.role
      });
      res.status(code.OK).json({ ...result, message: "OTP sent to email" });
    } catch (error: any) {
      res.status(code.BAD_REQUEST).json({ message: error.message });
      console.log(error)
    }
  }

 async registerVerify(req: Request, res: Response) {
    try {
      console.log("it is reached in verify otp")
      const dto = new OtpVerificationRequestDto(
        req.body.email,
        req.body.otp
      )
      const result = await this.authService.registerVerify(dto.email, dto.otp );

      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "OTP verification failed" });
      console.log(err)
    }
  }


  async resendOtp(req: Request, res: Response) {
  try {
    const dto = new resendOtpRequestDto(
      req.body.email 
    )

    const {  email: userEmail } =
      await this.authService.resendOtp( dto.email );

    res.status(code.OK).json({ email: userEmail });
  } catch (error: any) {
    res.status(code.BAD_REQUEST).json({ message: error.message });
    console.log(error)
  }
}


  async forgotPassword(req: Request, res: Response) {
    try {
      const dto = new ForgotPasswordRequestDto(
        req.body.email
      )
      const result = await this.authService.forgotPassword(dto.email);
      res.status(200).json(result);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
      console.error(error)
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const dto = new ResetPasswordrequestDto(
        req.body.token,
        req.body.newPassword
      )
      const result = await this.authService.resetPassword(dto.token, dto.newPassword);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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
