import { Schema, model, Types, Document } from 'mongoose';

export interface IMessage extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: string;
    isRead: boolean;
    type: 'text' | 'image' | 'file';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            enum: ['text', 'image', 'audio', 'file'],
            default: 'text',
        },
        metadata: {
            type: Map,
            of: Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);

export const MessageModel = model<IMessage>('Message', MessageSchema);
