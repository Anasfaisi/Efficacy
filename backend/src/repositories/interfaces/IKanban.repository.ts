import { KanbanBoardFromEntity } from '@/entity/from.entity';
import { KanbanBoardToEntity } from '@/entity/to.entity';

export interface IKanbanRepository {
    findKanbanBoardByUserId(id: string): Promise<KanbanBoardToEntity>;
    saveKanbanBoard(board: KanbanBoardFromEntity): Promise<KanbanBoardToEntity>;
}
