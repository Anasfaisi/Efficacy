import { KanbanBoard } from '@/Dto/request.dto';
import { KanbanBoardFromEntity } from '@/entity/fromEntity';
import { KanbanBoardToEntity } from '@/entity/toEntity';
import { IKanbanBoard } from '@/models/Kanban-board.model';

export interface IKanbanRepository {
    findKanbanBoardByUserId(id: string): Promise<KanbanBoardToEntity>;
    saveKanbanBoard(board: KanbanBoardFromEntity): Promise<KanbanBoardToEntity>;
}
