export interface ITokenService {
  generateAccessToken(userId: string, role: string): string;
  generateRefreshToken(userId: string, role: string): string;
  verifyAccessToken(token: string): { id: string; role: string; email: string };
  verifyRefreshToken(refreshToken: string): { id: string; role: string };
}