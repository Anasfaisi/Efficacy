import { IKanbanRepository } from './interfaces/IKanban.repository';
import { BaseRepository } from './base.repository';
import KanbanBoardModel, { IKanbanBoard } from '@/models/kanban-board.model';
import { KanbanMapper } from '@/Mapper/kanban.mapper';
import { KanbanBoardFromEntity } from '@/entity/from.entity';
import { KanbanBoardToEntity } from '@/entity/to.entity';
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
