import { IKanbanRepository } from './interfaces/IKanban.repository';
import { BaseRepository } from './base.repository';
import { IUser } from '@/models/User.model';
import KanbanBoardModel, { IKanbanBoard } from '@/models/Kanban-board.model';

export class KanbanRepository
    extends BaseRepository<IKanbanBoard>
    implements IKanbanRepository
{
    constructor() {
        super(KanbanBoardModel);
    }

    async findKanbanBoardByUserId(id: string): Promise<IKanbanBoard | null> {
        const KanbanBoard = await this.model.findOne({ userId: id });
        console.log(KanbanBoard, 'in the repo');
        return KanbanBoard;
    }
}
