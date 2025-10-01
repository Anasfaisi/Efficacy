import "@/config/env.config";
import jwt from "jsonwebtoken";
import { ITokenService } from "./Interfaces/IToken.service";
import { Types } from "mongoose";
export interface JwtPayload {
  id: string;
  role?: string;
}
export class TokenService implements ITokenService {
  private _accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET!;
  private _refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET!;

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, this._accessTokenSecret, {
      expiresIn:  "15m" ,
    });
  }

  generateRefreshToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, this._refreshTokenSecret, {
      expiresIn: "1d",
    });
  }

  verifyAccessToken(token: string): {
    id: string;
    role: string;
    email: string;
  } {
    return jwt.verify(token, this._accessTokenSecret) as {
      id: string;
      role: string;
      email: string;
    };
  }

  verifyRefreshToken(refreshToken: string): { id: string; role: string } {
    return jwt.verify(refreshToken, this._refreshTokenSecret) as {
      id: string;
      role: string;
    };
  }

  generatePasswordResetToken(userId: Types.ObjectId): string {
    return jwt.sign({ id: userId }, this._accessTokenSecret, {
      expiresIn: "15m",
    });
  }

  verifyPasswordResetToken(token: string): JwtPayload {
    const payload = jwt.verify(token, this._accessTokenSecret) as JwtPayload;
    return payload;
  }
}
