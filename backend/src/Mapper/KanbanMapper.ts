import {
    KanbanBoardFromEntity,
    kanbanColumnFromEntity,
} from '@/entity/fromEntity';
import {
    KanbanBoardToEntity,
    kanbanColumnToEntity,
    kanbanTaskToEntity,
} from '@/entity/toEntity';
import { IKanbanBoard } from '@/models/Kanban-board.model';
import { ColumnId } from '@/types/column-enum.types';
import { Types } from 'mongoose';

export class KanbanMapper {
    static toDomain(board: IKanbanBoard): KanbanBoardToEntity {
        const columns = board.columns.map((col) => {
            const tasks = col.tasks.map(
                (task) =>
                    new kanbanTaskToEntity(
                        task.taskId,
                        task.title,
                        task.description ?? '',
                        task.dueDate ?? '',
                        task.approxTimeToFinish ?? ''
                    )
            );

            return new kanbanColumnToEntity(col.columnId, col.title, tasks);
        });

        return new KanbanBoardToEntity(board.userId.toString(),columns);
    }

    static toPersistence(domainBoard: KanbanBoardFromEntity, userId: string) {
        return {
            userId: new Types.ObjectId(userId),
            columns: domainBoard.columns.map((col) => ({
                columnId: col.columnId,
                title: col.title,
                tasks: col.tasks.map((task) => ({
                    taskId: task.taskId,
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate,
                    approxTimeToFinish: task.approxTimeToFinish,
                })),
            })),
        };
    }

    static emptyBoard(id: string): KanbanBoardFromEntity {
        const columns = [
            new kanbanColumnFromEntity(ColumnId.TODO, 'To Do', []),
            new kanbanColumnFromEntity(ColumnId.IN_PROGRESS, 'In Progress', []),
            new kanbanColumnFromEntity(ColumnId.DONE, 'Done', []),
        ];

        return new KanbanBoardFromEntity(id, columns);
    }
}
