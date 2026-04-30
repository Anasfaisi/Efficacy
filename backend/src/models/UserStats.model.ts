import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserStats extends Document {
    id:string;
    userId: Types.ObjectId;
    tasksCompleted: number;
    taskStreakDays: number;
    pomodorosCompleted: number;
    focusMinutes: number;
    sessionsCompleted: number;
    lastActivityDate: Date;
}
const UserStatsSchema = new Schema<IUserStats>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        tasksCompleted: { type: Number, default: 0 },
        taskStreakDays: { type: Number, default: 0 },
        pomodorosCompleted: { type: Number, default: 0 },
        focusMinutes: { type: Number, default: 0 },
        sessionsCompleted: { type: Number, default: 0 },
        lastActivityDate: { type: Date },
    },
    { timestamps: true }
);

export const UserStats = mongoose.model<IUserStats>(
    'UserStats',
    UserStatsSchema
);
