import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../serivces/token.service';
import { injectable, inject } from "inversify";
import { TYPES } from "../types/inversify-key.types";
import code from "@/types/http-status.enum"



export interface AdminAuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

@injectable()
export class AdminAccessMiddleware {
  constructor(
    @inject(TYPES.TokenService) private tokenService: TokenService
  ) {}

  handle = (req: AdminAuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(code.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    try {
      const decoded = this.tokenService.verifyAccessToken(token);

      if (decoded.role !== "admin") {
        res.status(code.FORBIDDEN).json({ message: "Forbidden" });
        return;
      }

      req.user = decoded;
      next();
    } catch (error: any) {
      res.status(code.UNAUTHORIZED).json({ message: error.message || "Invalid or expired token" });
    }
  };
}


export const adminRefreshMiddleware = (tokenService: TokenService) => {
  return (req: AdminAuthRequest, res: Response, next: NextFunction): void => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(code.UNAUTHORIZED).json({ message: 'No refresh token provided' });
      return;
    }
    try {
      const decoded = tokenService.verifyRefreshToken(refreshToken);
      if (decoded.role !== 'admin') {
        res.status(code.FORBIDDEN).json({ message: 'Forbidden' });
        return;
      }
      // req.user = decoded;
      next();
    } catch (error) {
      res.status(code.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
      return;
    }
  };
};