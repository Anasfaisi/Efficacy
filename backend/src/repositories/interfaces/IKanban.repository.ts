import { IKanbanBoard } from '@/models/Kanban-board.model';

export interface IKanbanRepository {
    findKanbanBoardByUserId(id: string): Promise<IKanbanBoard|null>;
}
