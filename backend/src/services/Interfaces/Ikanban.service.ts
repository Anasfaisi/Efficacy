import {
    AddKanbanTaskRequestDto,
    deleteKanbanTaskRequestDto,
    GetKanbanBoardRequestDto,
    reorderKanbanTaskRequestDto,
    updateKanbanTaskRequestDto,
} from '@/dto/request.dto';
import { KanbanBoardResponseDto } from '@/dto/response.dto';

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
        dto: reorderKanbanTaskRequestDto
    ): Promise<KanbanBoardResponseDto>;
}
