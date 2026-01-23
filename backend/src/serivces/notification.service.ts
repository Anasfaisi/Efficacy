import { inject, injectable } from 'inversify';
import { INotificationService } from './Interfaces/INotification.service';
import { INotification } from '@/models/Notification.model';
import { NotificationType } from '@/types/notification.enum';
import { Role } from '@/types/role.types';
import { TYPES } from '@/config/inversify-key.types';
import { INotificationRepository } from '@/repositories/interfaces/INotification.repository';
import { ISocketService } from './Interfaces/ISocket.service';

@injectable()
export class NotificationService implements INotificationService {
    constructor(
        @inject(TYPES.NotificationRepository)
        private _notificationRepository: INotificationRepository,
        @inject(TYPES.SocketService)
        private _socketService: ISocketService
    ) {}

    async createNotification(
        recipientId: string,
        recipientRole: Role,
        type: NotificationType,
        title: string,
        message: string,
        metadata?: Record<string, unknown>
    ): Promise<INotification> {
        const notification = await this._notificationRepository.create({
            recipientId,
            recipientRole,
            type,
            title,
            message,
            metadata,
            isRead: false,
        } as Partial<INotification>);
        this._socketService.emitNotification(recipientId, notification);

        return notification;
    }

    async getNotificationsByRecipient(
        recipientId: string
    ): Promise<INotification[]> {
        return this._notificationRepository.findByRecipient(recipientId);
    }

    async markAsRead(notificationId: string): Promise<void> {
        await this._notificationRepository.updateOne(notificationId, {
            isRead: true,
        } as Partial<INotification>);
    }

    async markAllAsRead(recipientId: string): Promise<void> {
        await this._notificationRepository.updateMany(
            { recipientId, isRead: false },
            { isRead: true } as Partial<INotification>
        );
    }

    async notifyAdmin(
        type: NotificationType,
        title: string,
        message: string,
        metadata?: Record<string, unknown>
    ): Promise<void> {
        await this.createNotification(
            'admin_global',
            Role.Admin,
            type,
            title,
            message,
            metadata
        );
    }
}
