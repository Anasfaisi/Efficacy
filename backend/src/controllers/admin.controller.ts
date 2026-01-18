import { Request, Response } from 'express';
import { AuthService } from '../serivces/auth.service';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import code from '@/types/http-status.enum';
import { IAuthService } from '@/serivces/Interfaces/IAuth.service';
import { AuthMessages } from '@/types/response-messages.types';
import { LoginRequestDto, UpdateUserStatusRequestDto } from '@/Dto/request.dto';
import { IAdminAuthService } from '@/serivces/Interfaces/IAdmin-authService';
import { INotificationService } from '@/serivces/Interfaces/INotification.service';
import { IAdminService } from '@/serivces/Interfaces/IAdmin.service';

@injectable()
export class AdminController {
    constructor(
        @inject(TYPES.AdminAuthService)
        private _adminAuthService: IAdminAuthService,
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService,
        @inject(TYPES.AdminService)
        private _adminService: IAdminService,
        @inject(TYPES.AuthService)
        private _authService: IAuthService
    ) {}

    async getNotifications(req: Request, res: Response): Promise<void> {
        const notifications =
            await this._notificationService.getNotificationsByRecipient(
                'admin_global'
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
        await this._notificationService.markAllAsRead('admin_global');
        res.status(code.OK).json({
            message: 'All notifications marked as read',
        });
    }

    async getMentorApplications(req: Request, res: Response): Promise<void> {
        const applications = await this._adminService.getMentorApplications();
        res.status(code.OK).json(applications);
    }

    async getMentorApplicationById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const application =
            await this._adminService.getMentorApplicationById(id);
        if (!application) {
            res.status(code.NOT_FOUND).json({
                message: 'Application not found',
            });
            return;
        }
        res.status(code.OK).json(application);
    }

    async approveMentorApplication(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await this._adminService.approveMentorApplication(id);
        res.status(code.OK).json({
            message: 'Application approved successfully',
        });
    }

    async rejectMentorApplication(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { reason } = req.body;
        await this._adminService.rejectMentorApplication(id, reason);
        res.status(code.OK).json({ message: 'Application rejected' });
    }

    async requestChangesMentorApplication(
        req: Request,
        res: Response
    ): Promise<void> {
        const { id } = req.params;
        const { reason } = req.body;
        await this._adminService.requestChangesMentorApplication(id, reason);
        res.status(code.OK).json({ message: 'Changes requested' });
    }

    async adminLogin(req: Request, res: Response) {
        const response = await this._adminAuthService.adminLogin(req.body);
        res.cookie('refreshToken', response.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('accessToken', response.accessToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(code.OK).json({
            message: 'adminlogin succesful',
            admin: response.admin,
        });
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
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred';
            res.status(code.UNAUTHORIZED).json({ message });
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
        } catch (error: unknown) {
            console.error('Logout error:', error);
            res.status(code.INTERNAL_SERVER_ERROR).json(
                AuthMessages.LogoutFailed
            );
        }
    }

    async getAllMentors(req: Request, res: Response): Promise<void> {
        const mentors = await this._adminService.getAllMentors();
        res.status(code.OK).json(mentors);
    }

    async getMentorById(req: Request, res: Response): Promise<void> {
        const id = req.currentUser?.id;
        if (!id) {
            res.status(code.UNAUTHORIZED).json({ message: 'User not found' });
            return;
        }
        const mentor = await this._adminService.getMentorById(id);
        if (!mentor) {
            res.status(code.NOT_FOUND).json({ message: 'Mentor not found' });
            return;
        }
        res.status(code.OK).json(mentor);
    }

    async updateMentorStatus(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { status } = req.body;
        await this._adminService.updateMentorStatus(id, status);
        res.status(code.OK).json({ message: 'Mentor status updated' });
    }

    //user management
    async getAllUsers(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
        const result = await this._adminService.getAllUsers(
            page,
            limit,
            search
        );
        res.status(code.OK).json(result);
    }

    async updateUserStatus(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const { isActive } = req.body;
        const dto = new UpdateUserStatusRequestDto(id, isActive);
        await this._adminService.updateUserStatus(dto);
        res.status(code.OK).json({
            message: 'User status updated successfully',
        });
    }
}
