import { IKanbanRepository } from './interfaces/IKanban.repository';
import { BaseRepository } from './base.repository';
import { IUser } from '@/models/User.model';
import KanbanBoardModel, { IKanbanBoard } from '@/models/Kanban-board.model';
import { IKanbanTask } from '@/models/kanban-task.model';
import { KanbanMapper } from '@/Mapper/KanbanMapper';
import { KanbanBoardFromEntity } from '@/entity/fromEntity';
import { KanbanBoardToEntity } from '@/entity/toEntity';
export class KanbanRepository
    extends BaseRepository<IKanbanBoard>
    implements IKanbanRepository
{
    constructor() {
        super(KanbanBoardModel);
    }

    async findKanbanBoardByUserId(id: string): Promise<KanbanBoardToEntity> {
        const kanbanBoard = await this.model.findOne({ userId: id });
        if (!kanbanBoard) {
            return KanbanMapper.emptyBoard(id);
        }
        return KanbanMapper.toDomain(kanbanBoard);
    }

    async saveKanbanBoard(
        board: KanbanBoardFromEntity
    ): Promise<KanbanBoardToEntity> {
        const persistence = KanbanMapper.toPersistence(board, board.id);
        const updatedBoard = await this.model.findOneAndUpdate(
            { userId: board.id },
            persistence,
            { upsert: true, new: true }
        );
        return KanbanMapper.toDomain(updatedBoard);
    }
}
