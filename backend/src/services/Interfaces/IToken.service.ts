import { Role } from '@/types/role.types';
import { Types } from 'mongoose';

export interface JwtPayload {
    id: string;
    role?: string;
    email: string;
}
export interface ITokenService {
    generateAccessToken(userId: string, role: string, email: string): string;
    generateRefreshToken(userId: string, role: string, email: string): string;
    verifyAccessToken(token: string): {
        id: string;
        role: Role;
        email: string;
    };
    verifyRefreshToken(refreshToken: string): {
        id: string;
        role: string;
        email: string;
    };
    generatePasswordResetToken(userId: Types.ObjectId): string;
    verifyPasswordResetToken(token: string): JwtPayload;
}
