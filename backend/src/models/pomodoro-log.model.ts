import mongoose, { Schema, Document } from 'mongoose';

export interface IPomodoroSession {
    startTime: Date;
    endTime: Date;
    duration: number;
    type: 'pomodoro' | 'shortBreak' | 'longBreak';
}

export interface IPomodoroLog extends Document {
    userId: mongoose.Types.ObjectId;
    date: string;
    totalFocusTime: number;
    totalCycles: number;
    sessions: IPomodoroSession[];
}

const PomodoroSessionSchema = new Schema<IPomodoroSession>({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    type: {
        type: String,
        enum: ['pomodoro', 'shortBreak', 'longBreak'],
        required: true,
    },
});

const PomodoroLogSchema = new Schema<IPomodoroLog>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: String, required: true },
        totalFocusTime: { type: Number, default: 0 },
        totalCycles: { type: Number, default: 0 },
        sessions: [PomodoroSessionSchema],
    },
    { timestamps: true }
);

PomodoroLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const PomodoroLogModel = mongoose.model<IPomodoroLog>(
    'PomodoroLog',
    PomodoroLogSchema
);
