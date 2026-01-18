
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { INotificationService } from '@/serivces/Interfaces/INotification.service';
import code from '@/types/http-status.enum';

@injectable()
export class NotificationController {
    constructor(
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService
    ) {}

    async getNotifications(req: Request, res: Response) {
        try {
            const recipientId = req.currentUser?.id;
            if (!recipientId) {
                res.status(code.UNAUTHORIZED).json({ message: 'User not found' });
                return;
            }

            const notifications =
                await this._notificationService.getNotificationsByRecipient(
                    recipientId
                );
            res.status(code.OK).json(notifications);
        } catch (error) {
            console.error('getNotifications error:', error);
            res.status(code.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to fetch notifications',
            });
        }
    }

    async markAsRead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(code.BAD_REQUEST).json({
                    message: 'Notification ID is required',
                });
                return;
            }

            await this._notificationService.markAsRead(id);
            res.status(code.OK).json({ message: 'Marked as read' });
        } catch (error) {
            console.error('markAsRead error:', error);
            res.status(code.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to mark notification as read',
            });
        }
    }

    async markAllAsRead(req: Request, res: Response) {
        try {
            const recipientId = req.currentUser?.id;
            if (!recipientId) {
                res.status(code.UNAUTHORIZED).json({ message: 'User not found' });
                return;
            }

            await this._notificationService.markAllAsRead(recipientId);
            res.status(code.OK).json({ message: 'All marked as read' });
        } catch (error) {
            console.error('markAllAsRead error:', error);
            res.status(code.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to mark all as read',
            });
        }
    }
}
