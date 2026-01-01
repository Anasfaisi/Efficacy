import { inject, injectable } from "inversify";
import { INotificationService } from "./Interfaces/INotification.service";
import { INotification } from "@/models/Notification.model";
import { NotificationType } from "@/types/notification.enum";
import { Role } from "@/types/role.types";
import { TYPES } from "@/config/inversify-key.types";
import { INotificationRepository } from "@/repositories/interfaces/INotification.repository";
import { ISocketService } from "./Interfaces/ISocket.service";

@injectable()
export class NotificationService implements INotificationService {
    constructor(
        @inject(TYPES.NotificationRepository)
        private _notificationRepository: INotificationRepository,
        @inject(TYPES.SocketService)
        private _socketService: ISocketService
    ) { }

    async createNotification(
        recipientId: string,
        recipientRole: Role,
        type: NotificationType,
        title: string,
        message: string,
        metadata?: Record<string, any>
    ): Promise<INotification> {
        const notification = await this._notificationRepository.create({
            recipientId,
            recipientRole,
            type,
            title,
            message,
            metadata,
            isRead: false,
        } as any);

        // Emit via socket
        // If it's for a specific user, we might need a specific room. 
        // For now, let's emit to a room based on recipientId or Role
        this._socketService.emitToRoom(recipientId, 'newNotification', notification);
        this._socketService.emitToRoom(recipientRole, 'newNotification', notification);

        return notification;
    }

    async getNotificationsByRecipient(recipientId: string): Promise<INotification[]> {
        return this._notificationRepository.findByRecipient(recipientId);
    }

    async markAsRead(notificationId: string): Promise<void> {
        await this._notificationRepository.updateOne(notificationId, { isRead: true } as any);
    }

    async notifyAdmin(type: NotificationType, title: string, message: string, metadata?: Record<string, any>): Promise<void> {
        // Broadly notify all admins. 
        // Assuming admins join a room called 'admin'
        await this.createNotification('admin_global', Role.Admin, type, title, message, metadata);
    }
}
