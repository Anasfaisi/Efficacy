import { NotificationType } from '@/types/notification.enum';
import { Role } from '@/types/role.types';
import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
    recipientId: string;
    recipientRole: Role;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;

    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema(
    {
        recipientId: {
            type: String,
            required: true,
            index: true,
        },
        recipientRole: {
            type: String,
            enum: Object.values(Role),
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

export const NotificationModel = model<INotification>(
    'Notification',
    NotificationSchema
);
