import { Request, Response } from "express";
import { AuthService } from "../serivces/AuthSerivice";
import { ValidationService } from "../serivces/ValidationService";
import { TYPES } from "@/types";
import { inject } from "inversify";

export class MentorController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.ValidationService)
    private validationService: ValidationService
  ) {}

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      this.validationService.validateRegisterInput({ email, password, name });
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
      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      console.log(email, password, role, "data coming from the frontend");
      this.validationService.validateLoginInput({
        email,
        password,
        role,
        endpoint: "mentor",
      });
      console.log("finished validaton and the result now");

      const result = await this.authService.login(email, password, role);
      console.log(result);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async googleAuth(req: Request, res: Response) {
    try {
      const { googleToken, role } = req.body;
      this.validationService.validateGoogleLoginInput({
        role,
        endpoint: "mentor",
      });
      const result = await this.authService.loginWithGoogle(googleToken, role);

      console.log("Google login result:", result);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      console.error(error);
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      console.log("at the mentor logout route", req.cookies);
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error("Invalid refresh token or no refresh token");
      }
      await this.authService.logout(refreshToken);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      console.error("Logout error:", error.message);
      res.status(500).json({ message: "Logout failed" });
    }
  }
}
