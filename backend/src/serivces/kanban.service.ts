import {
    AddKanbanTaskRequestDto,
    deleteKanbanTaskRequestDto,
    GetKanbanBoardRequestDto,
    reorderKanbanTaskRequestDto,
    updateKanbanTaskRequestDto,
} from '@/Dto/request.dto';
import { KanbanBoardResponseDto } from '@/Dto/response.dto';
import { IKanbanRepository } from '@/repositories/interfaces/IKanban.repository';
import { TYPES } from '@/config/inversify-key.types';
import { inject, injectable } from 'inversify';
import { IKanbanService } from './Interfaces/Ikanban.service';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class KanbanService implements IKanbanService {
    constructor(
        @inject(TYPES.KanbanRepository)
        private _kanbanRepository: IKanbanRepository
    ) {}
    async getKanbanBoard(
        dto: GetKanbanBoardRequestDto
    ): Promise<KanbanBoardResponseDto> {
        const kanbanBoard =
            await this._kanbanRepository.findKanbanBoardByUserId(dto.id);

        return new KanbanBoardResponseDto(kanbanBoard.columns);
    }

    async addkanbanTask(
        dto: AddKanbanTaskRequestDto
    ): Promise<KanbanBoardResponseDto | null> {
        const board = await this._kanbanRepository.findKanbanBoardByUserId(
            dto.id
        );
        const column = board?.columns.find(
            (col) => col.columnId == dto.columnId
        );
        column?.tasks.push(dto.task);
        board.id = dto.id;

        const updatedBoard =
            await this._kanbanRepository.saveKanbanBoard(board);

        return new KanbanBoardResponseDto(updatedBoard.columns);
    }

    async updateKanbanTask(
        dto: updateKanbanTaskRequestDto
    ): Promise<KanbanBoardResponseDto> {
        const board = await this._kanbanRepository.findKanbanBoardByUserId(
            dto.id
        );
        const column = board.columns.find((c) => c.columnId === dto.columnId);
        if (!column) throw new Error(ErrorMessages.InvalidColumn);

        const task = column.tasks.find((t) => t.taskId === dto.taskId);
        if (!task) throw new Error(ErrorMessages.TaskNotFound);

        Object.assign(task, dto.data);
        const saved = await this._kanbanRepository.saveKanbanBoard(board);
        return new KanbanBoardResponseDto(saved.columns);
    }

    async deleteKanbanTask(
        dto: deleteKanbanTaskRequestDto
    ): Promise<KanbanBoardResponseDto> {
        const board = await this._kanbanRepository.findKanbanBoardByUserId(
            dto.id
        );
        if (!board) throw new Error(ErrorMessages.NoBoard);

        const column = board.columns.find((c) => c.columnId === dto.columnId);
        if (!column) throw new Error(ErrorMessages.InvalidColumn);

        const taskIndex = column.tasks.findIndex(
            (t) => t.taskId === dto.taskId
        );
        if (taskIndex === -1) throw new Error(ErrorMessages.TaskNotFound);

        column.tasks.splice(taskIndex, 1);

        const updated = await this._kanbanRepository.saveKanbanBoard(board);
        return new KanbanBoardResponseDto(updated.columns);
    }

    async reorderKanbanTask(
        dto: reorderKanbanTaskRequestDto
    ): Promise<KanbanBoardResponseDto> {
        const board = await this._kanbanRepository.findKanbanBoardByUserId(
            dto.id
        );

        const sourceCol = board.columns.find(
            (c) => c.columnId === dto.sourceColumnId
        );
        const destCol = board.columns.find(
            (c) => c.columnId === dto.destColumnId
        );

        if (!sourceCol || !destCol) throw new Error(ErrorMessages.InvalidColumn);

        const [task] = sourceCol.tasks.splice(dto.sourceTaskIndex, 1);
        destCol.tasks.splice(dto.destTaskIndex, 0, task);

        const updated = await this._kanbanRepository.saveKanbanBoard(board);
        console.log(updated, '===========');

        return new KanbanBoardResponseDto(updated.columns);
    }
}
