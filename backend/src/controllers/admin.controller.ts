import { Request, Response } from 'express';
import { AuthService } from '../serivces/auth.service';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import code from '@/types/http-status.enum';
import { IAuthService } from '@/serivces/Interfaces/IAuth.service';
import { AuthMessages } from '@/types/response-messages.types';
import { LoginRequestDto } from '@/Dto/request.dto';

@injectable()
export class AdminController {
    constructor(
        @inject(TYPES.AuthService) private _authService: IAuthService
    ) {}

    async login(req: Request, res: Response) {
        try {
            const dto = new LoginRequestDto(
                req.body.email,
                req.body.password,
                req.body.role
            );

            const responseDto = await this._authService.login({
                email: dto.email,
                password: dto.password,
                role: dto.role,
            });

            res.cookie('refreshToken', responseDto.refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.cookie('accessToken', responseDto.accessToken, {
                httpOnly: true,
                secure: true,
            });
            res.status(code.OK).json(responseDto.toJSON());
        } catch (error: any) {
            res.status(code.UNAUTHORIZED).json({ message: error.message });
        }
    }

    async refreshTokenHandler(req: Request, res: Response) {
        try {
            const token = req.cookies.refreshToken;
            if (!token) {
                throw new Error('No refresh token provided');
            }
            const { accessToken, refreshToken } =
                await this._authService.refreshToken(token);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });

            res.json({ success: true });
        } catch (error: any) {
            res.status(code.UNAUTHORIZED).json({ message: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.status(code.OK).json(AuthMessages.LogoutSuccess);
        } catch (error: any) {
            console.error('Logout error:', error);
            res.status(code.INTERNAL_SERVER_ERROR).json(
                AuthMessages.LogoutFailed
            );
        }
    }
}
