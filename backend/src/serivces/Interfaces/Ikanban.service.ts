import { GetKanbanBoardRequestDto } from '@/Dto/request.dto';
import { GetKanbanBoardResponseDto } from '@/Dto/response.dto';

export interface IKanbanService {

    getKanbanBoard(dto: GetKanbanBoardRequestDto): Promise<GetKanbanBoardResponseDto|null>;
}
