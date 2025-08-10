import jwt from 'jsonwebtoken';

export class TokenService {
  private accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
  private refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, this.accessTokenSecret, { expiresIn: '1m' });
  }

  generateRefreshToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, this.refreshTokenSecret, { expiresIn: '7d' });
  }

  verifyAccessToken(token: string): { id: string; role: string; email: string } {
    return jwt.verify(token, this.accessTokenSecret) as { id: string; role: string; email: string };
  }

  verifyRefreshToken(refreshToken: string): { id: string; role: string } {
    return jwt.verify(refreshToken, this.refreshTokenSecret) as { id: string; role: string };
  }
}
