import { Document, model, Schema, Types } from 'mongoose';
import { IKanbanColumn, KanbanColumnSchema } from './Kanban-column.model';

export interface IKanbanBoard extends Document {
    userId: Types.ObjectId;
    columns: IKanbanColumn[];
}

const KanbanBoardSchema = new Schema<IKanbanBoard>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    columns: [KanbanColumnSchema],
});

export default model<IKanbanBoard>('KanbanBoards', KanbanBoardSchema);
