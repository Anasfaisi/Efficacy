import { Document, model, Schema } from 'mongoose';

export interface IKanbanTask extends Document {
    taskId: string;
    title: string;
    description: string;
    dueDate: string;
    approxTimeToFinish: string;
    // position: number;
}

export const KanbanTaskSchema = new Schema({
    taskId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String },
    approxTimeToFinish: { type: String },
    // position: { type: Number },
});

export default model<IKanbanTask>('KanbanTasks', KanbanTaskSchema);
