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
        if (!req.body.id) {
            throw new Error(ErrorMessages.NoBody);
        }

        const kanbanBoard = await this._kanbanService.getKanbanBoard(req.body);

        if (!kanbanBoard) {
            res.status(HttpStatus.NO_CONTENT).json({
                message: ErrorMessages.NoBoard,
            });
            return;
        }

        res.status(HttpStatus.OK).json({
            message: SuccessMessages.ResourceDelivered,
            kanbanBoard,
        });
    }

    async addKanbanTask(req: Request, res: Response) {
        if (!req.body) throw new Error(ErrorMessages.NoBody);

        const kanbanBoard = await this._kanbanService.addkanbanTask(req.body);

        if (!kanbanBoard) {
            res.status(HttpStatus.NO_CONTENT).json({
                message: ErrorMessages.NotAdded,
            });
            return;
        }
        res.status(HttpStatus.OK).json({
            message: SuccessMessages.ResourceDelivered,
            kanbanBoard,
        });
    }

    async updateKanbanTask(req: Request, res: Response) {
        const kanbanBoard = await this._kanbanService.updateKanbanTask(
            req.body
        );
        if (!kanbanBoard) {
            res.status(HttpStatus.NO_CONTENT).json({
                message: ErrorMessages.NotAdded,
            });
            return;
        }
        res.status(HttpStatus.OK).json({
            message: SuccessMessages.ResourceDelivered,
            kanbanBoard,
        });
    }

    async deleteKanbanTask(req: Request, res: Response) {
        const request = req.body;
        request.id = req.params.id;

        const kanbanBoard = this._kanbanService.deleteKanbanTask(request);
        if (!kanbanBoard) {
            res.status(HttpStatus.NO_CONTENT).json({
                message: ErrorMessages.NotAdded,
            });
            return;
        }
    }

    async reorderKanbanTask(req: Request, res: Response) {
        const kanbanBoard = await this._kanbanService.reorderKanbanTask(
            req.body
        );
        if (!kanbanBoard) {
            res.status(HttpStatus.NO_CONTENT).json({
                message: ErrorMessages.NotAdded,
            });
            return;
        }

        res.status(HttpStatus.OK).json({
            message: SuccessMessages.ResourceDelivered,
            kanbanBoard,
        });
    }
}
