import {
    AddKanbanTaskRequestDto,
    deleteKanbanTaskRequestDto,
    GetKanbanBoardRequestDto,
    KanbanBoard,
    reorderKanbanTaskRequestDto,
    updateKanbanTaskRequestDto,
} from '@/Dto/request.dto';
import { KanbanBoardResponseDto } from '@/Dto/response.dto';

export interface IKanbanService {
    getKanbanBoard(
        dto: GetKanbanBoardRequestDto
    ): Promise<KanbanBoardResponseDto | null>;
    addkanbanTask(
        dto: AddKanbanTaskRequestDto
    ): Promise<KanbanBoardResponseDto | null>;

    updateKanbanTask(
        dto: updateKanbanTaskRequestDto
    ): Promise<KanbanBoardResponseDto>;
    deleteKanbanTask(
        dto: deleteKanbanTaskRequestDto
    ): Promise<KanbanBoardResponseDto>;

    reorderKanbanTask(
        dto:reorderKanbanTaskRequestDto
    ):Promise<KanbanBoardResponseDto>
}
