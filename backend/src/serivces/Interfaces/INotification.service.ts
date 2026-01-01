import { INotification } from "@/models/Notification.model";
import { NotificationType } from "@/types/notification.enum";
import { Role } from "@/types/role.types";

export interface INotificationService {
    createNotification(
        recipientId: string,
        recipientRole: Role,
        type: NotificationType,
        title: string,
        message: string,
        metadata?: Record<string, any>
    ): Promise<INotification>;

    getNotificationsByRecipient(recipientId: string): Promise<INotification[]>;

    markAsRead(notificationId: string): Promise<void>;

    notifyAdmin(type: NotificationType, title: string, message: string, metadata?: Record<string, any>): Promise<void>;
}
