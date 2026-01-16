import { Document, model, Schema, Types } from 'mongoose';

export enum Priority {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
}

export interface ISubtask {
    title: string;
    completed: boolean;
}

export interface IPlannerTask extends Document {
    userId: Types.ObjectId;
    title: string;
    description?: string;
    priority: Priority;
    startDate: Date;
    endDate: Date;
    subtasks: ISubtask[];
    completed: boolean;
}

const PlannerTaskSchema = new Schema<IPlannerTask>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        title: { type: String, required: true },
        description: { type: String },
        priority: {
            type: String,
            enum: Object.values(Priority),
            default: Priority.LOW,
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        subtasks: [
            {
                title: { type: String, required: true },
                completed: { type: Boolean, default: false },
            },
        ],
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model<IPlannerTask>('PlannerTasks', PlannerTaskSchema);
