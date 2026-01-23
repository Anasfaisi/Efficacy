import { Schema, model, Types, Document } from 'mongoose';

const ParticipantSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'participants.onModel',
        },
        onModel: {
            type: String,
            required: true,
            enum: ['Users', 'Mentors'],
        },
    },
    { _id: false }
);

export interface IConversation extends Document {
    participants: {
        _id: Types.ObjectId | any; 
        onModel: string;
    }[];
    isActive: boolean;
    lastMessage?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
    {
        participants: [ParticipantSchema],
        isActive: { type: Boolean, default: true },
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            default: null,
        },
    },
    { timestamps: true }
);

ConversationSchema.index({ participants: 1 });

export const ConversationModel = model<IConversation>(
    'Conversation',
    ConversationSchema
);
