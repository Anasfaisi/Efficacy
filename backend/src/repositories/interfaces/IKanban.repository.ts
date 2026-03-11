import { KanbanBoardFromEntity } from '@/entity/fromEntity';
import { KanbanBoardToEntity } from '@/entity/toEntity';

export interface IKanbanRepository {
    findKanbanBoardByUserId(id: string): Promise<KanbanBoardToEntity>;
    saveKanbanBoard(board: KanbanBoardFromEntity): Promise<KanbanBoardToEntity>;
}
