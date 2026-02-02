import mongoose, { Schema, Document } from 'mongoose';

export interface IPomodoroSession {
    startTime: Date;
    endTime: Date;
    duration: number; // in seconds
    type: 'pomodoro' | 'shortBreak' | 'longBreak';
}

export interface IPomodoroLog extends Document {
    userId: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD
    totalFocusTime: number; // in seconds
    totalCycles: number;
    sessions: IPomodoroSession[];
}

const PomodoroSessionSchema = new Schema<IPomodoroSession>({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    type: { type: String, enum: ['pomodoro', 'shortBreak', 'longBreak'], required: true },
});

const PomodoroLogSchema = new Schema<IPomodoroLog>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Index this for frequent querying by day
    totalFocusTime: { type: Number, default: 0 },
    totalCycles: { type: Number, default: 0 },
    sessions: [PomodoroSessionSchema]
}, { timestamps: true });

// Compound index for unique log per user per day logic if needed, 
// though we usually update the existing doc.
PomodoroLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const PomodoroLogModel = mongoose.model<IPomodoroLog>('PomodoroLog', PomodoroLogSchema);
