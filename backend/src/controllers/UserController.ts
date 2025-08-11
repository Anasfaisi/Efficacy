import { Request, Response } from "express";
import { AuthService } from "../serivces/AuthSerivice";
import { ValidationService } from "../serivces/ValidationService";
import { TYPES } from "@/types";
import { inject } from "inversify";

export class UserController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.ValidationService)
    private validationService: ValidationService
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      console.log(email, password, role, "data coming from the frontend");
      this.validationService.validateLoginInput({
        email,
        password,
        role,
        endpoint: "user",
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

  async register(req: Request, res: Response) {
    try {
      const { email, password, name ,role} = req.body;
      this.validationService.validateRegisterInput({ email, password, name });
      const result = await this.authService.registerUser({
        email,
        password,
        name,
        role
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
      res.status(401).json({ message: error.message });
    }
  }

  async logout (req: Request, res: Response) {
    try {
      console.log("at the logout route", req.cookies);
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
