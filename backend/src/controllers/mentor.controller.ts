import { Request, Response } from 'express';
import { AuthService } from '../serivces/auth.service';
import { TYPES } from '@/config/inversify-key.types';
import { inject } from 'inversify';
import code from '@/types/http-status.enum';
import { IAuthService } from '@/serivces/Interfaces/IAuth.service';
import { AuthMessages } from '@/types/response-messages.types';
import {
    OtpVerificationRequestDto,
    RegisterRequestDto,
} from '@/Dto/request.dto';
import { UpdateMentorProfileDto } from '@/Dto/mentorRequest.dto';

export class MentorController {
    constructor(
        @inject(TYPES.AuthService) private _authService: IAuthService
    ) {}

    async mentorRegisterInit(req: Request, res: Response) {
        const result = await this._authService.mentorRegisterInit(req.body);
        res.status(code.OK).json({
            ...result,
            message: AuthMessages.OtpSuccess,
        });
    }

    async menotrRegisterVerify(req: Request, res: Response) {
        const { accessToken, refreshToken, user } =
            await this._authService.mentorRegisterVerify(req.body);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
        });

        res.status(200).json(user);
    }

    async login(req: Request, res: Response) {
        const result = await this._authService.mentorLogin(req.body);
        console.log(result);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
        });

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
        });

        res.json({ user: result.user });
    }
    // async googleAuth(req: Request, res: Response) {
    //     try {
    //         const { googleToken, role } = req.body;

    //         const result = await this._authService.loginWithGoogle(
    //             googleToken,
    //             role
    //         );
    //         console.log('Google login result:', result);
    //         res.cookie('refreshToken', result.refreshToken, {
    //             httpOnly: true,
    //             secure: true,
    //         });
    //         res.cookie('accessToken', result.accessToken, {
    //             httpOnly: true,
    //             secure: true,
    //         });

    //         res.status(code.OK).json({ user: result.user });
    //     } catch (error: any) {
    //         console.error(error);
    //         res.status(code.UNAUTHORIZED).json({ message: error.message });
    //     }
    // }

    async logout(req: Request, res: Response) {
        try {
            console.log('at the mentor logout route', req.cookies);
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new Error('Invalid refresh token or no refresh token');
            }
            await this._authService.logout(refreshToken);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.json(AuthMessages.LogoutSuccess);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Unknown error';
            console.error('Logout error:', message);
            res.status(code.INTERNAL_SERVER_ERROR).json(
                AuthMessages.LogoutFailed
            );
        }
    }
    async getProfile(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error('User context missing');
            const userId = req.user.id;
            const mentor = await this._authService.getMentorProfile(userId);
            res.status(code.OK).json({ mentor });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(code.NOT_FOUND).json({ message });
        }
    }
    async updateProfileBasicInfo(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error('User context missing');
            const userId = req.user.id;
            
            const updateDto = new UpdateMentorProfileDto();
            Object.assign(updateDto, req.body);

            const updatedMentor = await this._authService.updateMentorProfileBasicInfo(userId, updateDto);
            res.status(code.OK).json({ mentor: updatedMentor });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Update failed';
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async updateProfileMedia(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error('User context missing');
            const userId = req.user.id;
            const updatedMentor = await this._authService.updateMentorProfileMedia(userId, req.files);
            res.status(code.OK).json({ mentor: updatedMentor });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Media update failed';
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async updateProfileArray(req: Request, res: Response) {
        try {
            if (!req.user) throw new Error('User context missing');
            const userId = req.user.id;
            const { field, data } = req.body;
            
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            
            const updatedMentor = await this._authService.updateMentorProfileArray(userId, field, parsedData);
            res.status(code.OK).json({ mentor: updatedMentor });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Array update failed';
            res.status(code.BAD_REQUEST).json({ message });
        }
    }
}
