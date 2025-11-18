import { IKanbanRepository } from '@/repositories/interfaces/IKanban.repository';
import { IKanbanService } from '@/serivces/Interfaces/Ikanban.service';
import HttpStatus from '@/types/http-status.enum';
import { TYPES } from '@/config/inversify-key.types';
import {
    ErrorMessages,
    SuccessMessages,
} from '@/types/response-messages.types';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class KanbanController {
    constructor(
        @inject(TYPES.KanbanService) private _kanbanService: IKanbanService
    ) {}
    async getKanbanBoard(req: Request, res: Response) {
        try {
            if (!req.body.id) throw new Error(ErrorMessages.NoBody);

            const kanbanBoard = await this._kanbanService.getKanbanBoard(req.body.id);
            console.log(kanbanBoard,'from controller')
            if (!kanbanBoard){
                res.status(HttpStatus.NO_CONTENT).json({
                    message: ErrorMessages.NoBoard,
                });
            return;
            }

            res.status(HttpStatus.OK).json({
                message: SuccessMessages.ResourceDelivered,
                kanbanBoard
            });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: error.message,
                });
            }
        }
    }
}
