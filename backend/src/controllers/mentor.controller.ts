import { Request, Response } from "express";
import { AuthService } from "../serivces/auth.service";
import { TYPES } from "@/types";
import { inject } from "inversify";
import code from "@/types/http-status.enum"
import { IAuthService } from "@/serivces/Interfaces/IAuth.service";
import { AuthMessages } from "@/types/response-messages.types";

export class MentorController {
  constructor(
    @inject(TYPES.AuthService) private _authService:IAuthService,
    
  ) {}

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      const result = await this._authService.registerUser({
        email,
        password,
        name,
        role,
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      res.status(code.BAD_REQUEST).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
    

      const result = await this._authService.login(email, password, role);
      console.log(result);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      res.status(code.UNAUTHORIZED).json({ message: error.message });
    }
  }

  async googleAuth(req: Request, res: Response) {
    try {
      const { googleToken, role } = req.body;
     
      const result = await this._authService.loginWithGoogle(googleToken, role);

      console.log("Google login result:", result);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      console.error(error);
      res.status(code.UNAUTHORIZED).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      console.log("at the mentor logout route", req.cookies);
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error("Invalid refresh token or no refresh token");
      }
      await this._authService.logout(refreshToken);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json(AuthMessages.LogoutSuccess);
    } catch (error: any) {
      console.error("Logout error:", error.message);
      res.status(code.INTERNAL_SERVER_ERROR).json(AuthMessages.LogoutFailed);
    }
  }
}
