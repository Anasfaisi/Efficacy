import { Request, Response } from 'express';
import { TYPES } from '@/config/inversify-key.types';
import { inject } from 'inversify';
import code from '@/types/http-status.enum';
import { IMentorAuthService } from '@/serivces/Interfaces/IMentor-auth.service';
import { IMentorService } from '@/serivces/Interfaces/IMentor.service';
import { INotificationService } from '@/serivces/Interfaces/INotification.service';
import {
    AuthMessages,
    ErrorMessages,
    SuccessMessages,
    CommonMessages,
} from '@/types/response-messages.types';
import { UpdateMentorProfileDto } from '@/Dto/mentorRequest.dto';

export class MentorController {
    constructor(
        @inject(TYPES.MentorAuthService)
        private _mentorAuthService: IMentorAuthService,
        @inject(TYPES.MentorService) private _mentorService: IMentorService,
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService
    ) {}

    async mentorRegisterInit(req: Request, res: Response) {
        const result = await this._mentorAuthService.mentorRegisterInit(
            req.body
        );
        res.status(code.OK).json({
            ...result,
            message: AuthMessages.OtpSuccess,
        });
    }

    async menotrRegisterVerify(req: Request, res: Response) {
        console.log('it is reaching in mentor controller');
        const { accessToken, refreshToken, user } =
            await this._mentorAuthService.mentorRegisterVerify(req.body);

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
        const result = await this._mentorAuthService.mentorLogin(req.body);
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

    async logout(req: Request, res: Response) {
        try {
            console.log('at the mentor logout route', req.cookies);
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new Error(AuthMessages.InvalidRefreshToken);
            }
            await this._mentorAuthService.logout(refreshToken);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.json(AuthMessages.LogoutSuccess);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : CommonMessages.UnexpectedError;
            console.error('Logout error:', message);
            res.status(code.INTERNAL_SERVER_ERROR).json(
                AuthMessages.LogoutFailed
            );
        }
    }
    async getProfile(req: Request, res: Response) {
        try {
            if (!req.currentUser) throw new Error(ErrorMessages.UserContextMissing);
            const userId = req.currentUser.id;
            const mentor = await this._mentorService.getMentorProfile(userId);
            res.status(code.OK).json({ mentor });
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : CommonMessages.UnexpectedError;
            res.status(code.NOT_FOUND).json({ message });
        }
    }
    async updateProfileBasicInfo(req: Request, res: Response) {
        try {
            if (!req.currentUser) throw new Error(ErrorMessages.UserContextMissing);
            const userId = req.currentUser.id;

            const updateDto = new UpdateMentorProfileDto();
            Object.assign(updateDto, req.body);

            const updatedMentor =
                await this._mentorService.updateMentorProfileBasicInfo(
                    userId,
                    updateDto
                );
            res.status(code.OK).json({ mentor: updatedMentor });
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : ErrorMessages.GeneralUpdateFailed;
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async updateProfileMedia(req: Request, res: Response) {
        try {
            if (!req.currentUser) throw new Error(ErrorMessages.UserContextMissing);
            const userId = req.currentUser.id;
            const updatedMentor =
                await this._mentorService.updateMentorProfileMedia(
                    userId,
                    req.files
                );
            res.status(code.OK).json({ mentor: updatedMentor });
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : ErrorMessages.MediaUpdateFailed;
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async updateProfileArray(req: Request, res: Response) {
        try {
            if (!req.currentUser) throw new Error(ErrorMessages.UserContextMissing);
            const userId = req.currentUser.id;
            const { field, data } = req.body;

            const parsedData =
                typeof data === 'string' ? JSON.parse(data) : data;

            const updatedMentor =
                await this._mentorService.updateMentorProfileArray(
                    userId,
                    field,
                    parsedData
                );
            res.status(code.OK).json({ mentor: updatedMentor });
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : ErrorMessages.ArrayUpdateFailed;
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async getApprovedMentors(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || '';
            const sort = (req.query.sort as string) || '';

            const filters: {
                expertise?: { $regex: string; $options: string };
                monthlyCharge?: { $gte?: number; $lte?: number };
                rating?: { $gte: number };
            } = {};
            if (req.query.expertise) {
                filters.expertise = {
                    $regex: req.query.expertise as string,
                    $options: 'i',
                };
            }
            if (req.query.minPrice || req.query.maxPrice) {
                filters.monthlyCharge = {};
                if (req.query.minPrice)
                    filters.monthlyCharge.$gte = parseInt(
                        req.query.minPrice as string
                    );
                if (req.query.maxPrice)
                    filters.monthlyCharge.$lte = parseInt(
                        req.query.maxPrice as string
                    );
            }
            if (req.query.rating) {
                filters.rating = {
                    $gte: parseFloat(req.query.rating as string),
                };
            }

            const result = await this._mentorService.getApprovedMentors(
                page,
                limit,
                search,
                sort,
                filters
            );
            res.status(code.OK).json(result);
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch mentors';
            res.status(code.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.FetchMentorsFailed });
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const result = await this._mentorAuthService.mentorResendOtp(
                req.body
            );
            res.status(code.OK).json(result);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : ErrorMessages.ResendOtpFailed;
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        console.log('Mentor forgot password request received:', req.body);
        try {
            const result = await this._mentorAuthService.mentorForgotPassword(
                req.body
            );
            res.status(code.OK).json(result);
        } catch (error: unknown) {
            console.error('Mentor forgot password error:', error);
            const message =
                error instanceof Error
                    ? error.message
                    : ErrorMessages.ForgotPasswordFailed;
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const result = await this._mentorAuthService.mentorResetPassword(
                req.body
            );
            res.status(code.OK).json(result);
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : ErrorMessages.ResetPasswordFailed;
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            const result = await this._mentorAuthService.mentorLoginWithGoogle(
                req.body
            );

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: true,
            });

            res.status(code.OK).json(result);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : ErrorMessages.GoogleLoginFailed;
            res.status(code.BAD_REQUEST).json({ message });
        }
    }

    async getNotifications(req: Request, res: Response): Promise<void> {
        if (!req.currentUser) {
            res.status(code.UNAUTHORIZED).json({ message: CommonMessages.Unauthorized });
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
        res.status(code.OK).json({ message: SuccessMessages.NotificationMarkedRead });
    }

    async markAllNotificationsAsRead(
        req: Request,
        res: Response
    ): Promise<void> {
        if (!req.currentUser) {
            res.status(code.UNAUTHORIZED).json({ message: CommonMessages.Unauthorized });
            return;
        }
        await this._notificationService.markAllAsRead(req.currentUser.id);
        res.status(code.OK).json({
            message: SuccessMessages.AllNotificationsMarkedRead,
        });
    }
}
