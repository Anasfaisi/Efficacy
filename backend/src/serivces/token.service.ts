import jwt from 'jsonwebtoken';
import { ITokenService } from './Interfaces/IToken.service';
import { Types } from 'mongoose';

export interface JwtPayload {
  id: string;
  role?: string;
}
export class TokenService implements ITokenService {
  private accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
  private refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, this.accessTokenSecret, { expiresIn: '1m' });//read from env
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

  generatePasswordResetToken(userId:Types.ObjectId ): string {
  return jwt.sign({ id: userId }, this.accessTokenSecret, {
    expiresIn: "15m", 
  });
}

 verifyPasswordResetToken(token: string): JwtPayload  {
      const payload = jwt.verify(token, this.accessTokenSecret) as JwtPayload;
      return  payload ;
    }
}
