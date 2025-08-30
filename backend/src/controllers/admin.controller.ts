import { Request, Response } from "express";
import { AuthService } from "../serivces/auth.service";
import { injectable, inject } from "inversify";
import { TYPES } from "@/types";
import code from "@/types/http-status.enum";
import { IAuthService } from "@/serivces/Interfaces/IAuth.service";
import { AuthMessages } from "@/types/response-messages.types";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AuthService) private _authService: IAuthService,
  
  ) {}

  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
    
      const result = await this._authService.login(email, password,role);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error: any) {
      res.status(code.UNAUTHORIZED).json({ message: error.message });
    }
  }

  async refreshAdminToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error(AuthMessages.InvalidRefreshToken);
      }
      const result = await this._authService.refreshToken(refreshToken, "admin");
      res.json({ accessToken: result.accessToken });
    } catch (error: any) {
      res.status(code.UNAUTHORIZED).json({ message: error.message });
    }
  }

async adminLogout(req: Request, res: Response) {
  try {
    
    console.log("Logout controller reached");
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(code.NO_CONTENT).send(); 
    }

    await this._authService.logout(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(code.OK).json(AuthMessages.LogoutSuccess);
  } catch (error: any) {
    console.error("Logout error:", error.message);
    res.status(code.INTERNAL_SERVER_ERROR).json(AuthMessages.LogoutFailed);
  }
}

}
