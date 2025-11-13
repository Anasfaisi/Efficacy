import { Schema, model, Types } from 'mongoose';

export interface IChat {
    _id: Types.ObjectId;
    participants: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    isGroup?: boolean;
    groupName?: string;
    groupAvatar?: string;
    createdBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
const ChatSchema = new Schema(
    {
        particpants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            default: null,
        },
        isGroup: { type: Boolean, default: false },
        groupName: { type: String },
        createdBy: { type: Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export const ChatModel = model<IChat>('Chat', ChatSchema);
