import { ColumnId, ColumnIdValues } from '@/types/column-enum.types';
import { IKanbanTask, KanbanTaskSchema } from './kanban-task.model';
import { Schema } from 'mongoose';

export interface IKanbanColumn extends Document {
    columnId: ColumnId;
    title: string;
    tasks: IKanbanTask[];
}

export const KanbanColumnSchema = new Schema<IKanbanColumn>({
    columnId: { type: String, enum: ColumnIdValues, required: true },
    title: { type: String, required: true },
    tasks: [KanbanTaskSchema],
});
