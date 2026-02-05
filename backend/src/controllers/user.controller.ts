import { Request, Response } from 'express';
import { TYPES } from '@/config/inversify-key.types';
import { inject } from 'inversify';
import code from '@/types/http-status.enum';
import { IAuthService } from '@/serivces/Interfaces/IAuth.service';
import { INotificationService } from '@/serivces/Interfaces/INotification.service';
import { AuthMessages, ErrorMessages } from '@/types/response-messages.types';

export class UserController {
    constructor(
        @inject(TYPES.AuthService) private _authService: IAuthService,
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService
    ) {}

    async updateUserProfile(req: Request, res: Response) {
        try {
            if (!req.currentUser?.id) {
                res.status(code.BAD_REQUEST).json({
                    message: ErrorMessages.NoParams,
                });
                return;
            }
            const updatedUser = await this._authService.updateUserProfile(
                req.body,
                req.currentUser?.id
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
                console.error('updateProfile error:', error);
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

            if (!req.currentUser?.id) {
                res.status(code.BAD_REQUEST).json({
                    message: ErrorMessages.NoParams,
                });
                return;
            }

            const updatedProfilePic =
                await this._authService.updateUserProfilePic({
                    file: req.file,
                    id: req.currentUser?.id,
                });
            if (!updatedProfilePic) {
                res.status(code.BAD_REQUEST).json({
                    messages: ErrorMessages.UpdateProfilePicFailed,
                });
                return;
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
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Login failed';
            res.status(code.BAD_REQUEST).json({ message });
            console.log(error);
        }
    }

    async registerInit(req: Request, res: Response) {
        const result = await this._authService.registerInit(req.body);
        res.status(code.OK).json({
            ...result,
            message: AuthMessages.OtpSuccess,
        });
    }

    async registerVerify(req: Request, res: Response) {
        const { accessToken, refreshToken, user } =
            await this._authService.registerVerify(req.body);

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

    async resendOtp(req: Request, res: Response) {
        console.log(req.body.email, 'req.body.emai');
        const { tempEmail, resendAvailableAt } =
            await this._authService.resendOtp(req.body);

        res.status(code.OK).json({
            message: 'OTP sent succesfully',
            tempEmail,
            resendAvailableAt,
        });
    }

    async forgotPassword(req: Request, res: Response) {
        const result = await this._authService.forgotPassword(req.body);
        res.status(200).json(result);
    }

    async resetPassword(req: Request, res: Response) {
        const result = await this._authService.resetPassword(req.body);
        res.status(200).json(result);
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
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Token refresh failed';
            res.status(code.UNAUTHORIZED).json({ message });
        }
    }

    async googleAuth(req: Request, res: Response) {
        const result = await this._authService.userLoginWithGoogle(req.body);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
        });

        res.status(code.OK).json({ user: result.user });
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
        } catch (error: unknown) {
            console.error('Logout error:', error);
            res.status(code.INTERNAL_SERVER_ERROR).json(
                AuthMessages.LogoutFailed
            );
        }
    }

    async getNotifications(req: Request, res: Response): Promise<void> {
        if (!req.currentUser) {
            res.status(code.UNAUTHORIZED).json({ message: 'Unauthorized' });
            return;
        }
        const notifications =
            await this._notificationService.getNotificationsByRecipient(
                req.currentUser.id
            );
        res.status(code.OK).json(notifications);
    }

    async markNotificationAsRead(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await this._notificationService.markAsRead(id);
        res.status(code.OK).json({ message: 'Notification marked as read' });
    }

    async markAllNotificationsAsRead(
        req: Request,
        res: Response
    ): Promise<void> {
        if (!req.currentUser) {
            res.status(code.UNAUTHORIZED).json({ message: 'Unauthorizeds' });
            return;
        }
        await this._notificationService.markAllAsRead(req.currentUser.id);
        res.status(code.OK).json({
            message: 'All notifications marked as read',
        });
    }
}
