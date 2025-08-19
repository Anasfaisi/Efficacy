import { Types } from "mongoose";

export interface JwtPayload {
  id: string;
  role?: string;
}
export interface ITokenService {
  generateAccessToken(userId: string, role: string): string;
  generateRefreshToken(userId: string, role: string): string;
  verifyAccessToken(token: string): { id: string; role: string; email: string };
  verifyRefreshToken(refreshToken: string): { id: string; role: string };
  generatePasswordResetToken(userId: Types.ObjectId):  string 
    verifyPasswordResetToken(token: string):  JwtPayload;

}
