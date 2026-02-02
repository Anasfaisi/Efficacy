import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
    userId: Schema.Types.ObjectId;
    title: string;
    content: string;
    isSticky: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            default: 'Untitled Note',
        },
        content: {
            type: String,
            default: '',
        },
        isSticky: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const NoteModel = model<INote>('Note', NoteSchema);
