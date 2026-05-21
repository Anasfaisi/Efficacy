import jwt from 'jsonwebtoken';
import { ITokenService, JwtPayload } from './Interfaces/IToken.service';
import { Types } from 'mongoose';
import { Role } from '@/types/role.types';
import { injectable } from 'inversify';

@injectable()
export class TokenService implements ITokenService {
    private _accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET!;
    private _refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET!;

    generateAccessToken(userId: string, role: Role ,email:string): string {
        return jwt.sign({ id: userId, role, email }, this._accessTokenSecret, {
            expiresIn: '1d',
        });
    }

    generateRefreshToken(userId: string, role: Role ,email :string): string {
        return jwt.sign({ id: userId, role ,email}, this._refreshTokenSecret, {
            expiresIn: '14d',
        });
    }

    verifyAccessToken(token: string): {
        id: string;
        role: Role;
        email: string;
    } {
        return jwt.verify(token, this._accessTokenSecret) as {
            id: string;
            role: Role;
            email: string;
        };
    }

    verifyRefreshToken(refreshToken: string): { id: string; role: Role } {
        return jwt.verify(refreshToken, this._refreshTokenSecret) as {
            id: string;
            role: Role;
            email: string
        };
    }

    generatePasswordResetToken(userId: Types.ObjectId): string {
        return jwt.sign({ id: userId }, this._accessTokenSecret, {
            expiresIn: '1d',
        });
    }

    verifyPasswordResetToken(token: string): JwtPayload {
        const payload = jwt.verify(
            token,
            this._accessTokenSecret
        ) as JwtPayload;
        return payload;
    }
}
