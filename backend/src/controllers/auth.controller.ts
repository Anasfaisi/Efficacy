import { Request, Response } from 'express';
import { AuthService } from '../serivces/auth.service';
import { TYPES } from '@/types/inversify-key.types';
import { inject } from 'inversify';
import code from '@/types/http-status.enum';
import { IAuthService } from '@/serivces/Interfaces/IAuth.service';
import { AuthMessages, ErrorMessages } from '@/types/response-messages.types';
import {
    ForgotPasswordRequestDto,
    LoginRequestDto,
    OtpVerificationRequestDto,
    RefreshRequestDto,
    RegisterRequestDto,
    resendOtpRequestDto,
    ResetPasswordrequestDto,
} from '@/Dto/request.dto';

export class UserController {
    constructor(
        @inject(TYPES.AuthService) private _authService: IAuthService
    ) {}

    async updateUserProfile(req: Request, res: Response) {
        try {
            const updatedUser = await this._authService.updateUserProfile(
                req.body
            );
            if (!updatedUser) {
                res.status(code.BAD_REQUEST).json({
                    message: ErrorMessages.UpdateUserFailed,
                });
                return;
            } else {
                res.status(code.OK).json(updatedUser);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('updateProfilePic error:', error);
                res.status(code.INTERNAL_SERVER_ERROR).json({
                    message: error.message,
                });
            } else {
                console.error('Unknown error:', error);
                res.status(code.INTERNAL_SERVER_ERROR).json({
                    message: 'An unexpected error occurred',
                });
            }
        }
    }

    async updateProfilePic(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(code.BAD_REQUEST).json({
                    message: ErrorMessages.FileNotAttached,
                });
                return;
            }

            if (!req.params.id) {
                res.status(code.BAD_REQUEST).json({
                    message: ErrorMessages.NoParams,
                });
                return;
            }

            const updatedProfilePic =
                await this._authService.updateUserProfilePic({
                    file: req.file,
                    id: req.params.id,
                });
            if (!updatedProfilePic) {
                res.status(code.BAD_REQUEST).json({
                    messages: ErrorMessages.UpdateProfilePicFailed,
                });
            }
            res.status(200).json({
                message: 'Profile picture updated successfully',
                user: updatedProfilePic,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('updateProfilePic error:', error);
                res.status(code.INTERNAL_SERVER_ERROR).json({
                    message: error.message,
                });
            } else {
                console.error('Unknown error:', error);
                res.status(code.INTERNAL_SERVER_ERROR).json({
                    message: 'An unexpected error occurred',
                });
            }
        }
    }
    async login(req: Request, res: Response) {
        try {
            const { accessToken, refreshToken, user } =
                await this._authService.login(req.body);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
            });
            res.status(code.OK).json({ user });
        } catch (error: any) {
            res.status(code.BAD_REQUEST).json({ message: error.message });
            console.log(error);
        }
    }

    async registerInit(req: Request, res: Response) {
        try {
            const dto = new RegisterRequestDto(
                req.body.name,
                req.body.email,
                req.body.password,
                req.body.role
            );
            const result = await this._authService.registerInit({
                name: dto.name,
                email: dto.email,
                password: dto.password,
                role: dto.role,
            });
            res.status(code.OK).json({
                ...result,
                message: AuthMessages.OtpSuccess,
            });
        } catch (error: any) {
            res.status(code.BAD_REQUEST).json({ message: error.message });
            console.log(error);
        }
    }

    async registerVerify(req: Request, res: Response) {
        try {
            console.log('it is reached in verify otp');
            const dto = new OtpVerificationRequestDto(
                req.body.email,
                req.body.otp
            );
            const { accessToken, refreshToken, user } =
                await this._authService.registerVerify(dto.email, dto.otp);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
            });
            const result = { user: user };

            res.status(200).json(result);
        } catch (err: any) {
            res.status(400).json({
                message: err.message || AuthMessages.OtpFailed,
            });
            console.log(err);
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const dto = new resendOtpRequestDto(req.body.email);

            const { tempEmail: userEmail } = await this._authService.resendOtp(
                dto.email
            );

            res.status(code.OK).json({ email: userEmail });
        } catch (error: any) {
            res.status(code.BAD_REQUEST).json({ message: error.message });
            console.log(error);
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const dto = new ForgotPasswordRequestDto(req.body.email);
            const result = await this._authService.forgotPassword(dto.email);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
            console.error(error);
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const dto = new ResetPasswordrequestDto(
                req.body.token,
                req.body.newPassword
            );
            const result = await this._authService.resetPassword(
                dto.token,
                dto.newPassword
            );
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
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

    async googleAuth(req: Request, res: Response) {
        try {
            const { googleToken, role } = req.body;

            const result = await this._authService.loginWithGoogle(
                googleToken,
                role
            );
            console.log('Google login result:', result);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: true,
            });

            res.status(code.OK).json({ user: result.user });
        } catch (error: any) {
            console.error(error);
            res.status(code.UNAUTHORIZED).json({ message: error.message });
            console.log(error);
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

// async getCurrentUser(req: Request, res: Response) {
//     try {
//         const id = req.params.id;
//         const { user } = await this._authService.getCurrentUser(id);
//         if (!user) {
//             return res
//                 .status(code.UNAUTHORIZED)
//                 .json({ message: 'User not authenticated' });
//         }

//         res.status(code.OK).json({ user });
//     } catch (error: any) {
//         res.status(code.BAD_REQUEST).json({ message: error.message });
//     }
// }
