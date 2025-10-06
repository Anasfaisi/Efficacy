import { Schema, model, Types, Document } from 'mongoose';
import { MessageStatus } from '@/types/role.types';
export interface IMessage {
    _id:Types.ObjectId;
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: string;
    attachments?: string[];
    status?: MessageStatus;
    seenBy?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        attachments: [
            {
                type: String,
            },
        ],
        status: {
            type: String,
            enum:Object.values(MessageStatus),
            default: MessageStatus.SENT,
            required:false
        },
 
        seenBy: [
            {
                type: Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

export const Message = model<IMessage>('Message', MessageSchema);
