import { GetKanbanBoardRequestDto } from '@/Dto/request.dto';
import { GetKanbanBoardResponseDto } from '@/Dto/response.dto';
import { IKanbanRepository } from '@/repositories/interfaces/IKanban.repository';
import { TYPES } from '@/config/inversify-key.types';
import { ErrorMessages } from '@/types/response-messages.types';
import { inject, injectable } from 'inversify';
import { IKanbanService } from './Interfaces/Ikanban.service';
import { ColumnId } from '@/types/columnEnum.types';

@injectable()
export class KanbanService implements IKanbanService {
    constructor(
        @inject(TYPES.KanbanRepository)
        private _kanbanRepository: IKanbanRepository
    ) {}
    async getKanbanBoard(
        dto: GetKanbanBoardRequestDto
    ): Promise<GetKanbanBoardResponseDto> {
        console.log('-=============123');
        const kanbanBoard =
            await this._kanbanRepository.findKanbanBoardByUserId(dto.id);
        if (!kanbanBoard) {
            return {
                id: dto.id,
                columns: [
                    {
                        columnId: ColumnId.TODO,
                        title: 'To Do',
                        tasks: [
                            {
                                taskId: '1',
                                title: 'Set up project',
                                description:
                                    'Create React + Vite + Tailwind base',
                            },
                            {
                                taskId: '2',
                                title: 'Design Kanban layout',
                                description: 'Structure board, columns, cards',
                            },
                        ],
                    },
                    {
                        columnId: ColumnId.IN_PROGRESS,
                        title: 'In Progress',
                        tasks: [],
                    },
                    { columnId: ColumnId.DONE, title: 'Done', tasks: [] },
                ],
            };
        }

        return new GetKanbanBoardResponseDto(
            kanbanBoard.id,
            kanbanBoard.columns
        );
    }
}
