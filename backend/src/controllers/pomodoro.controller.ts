import { Request, Response } from 'express';
import { IPomodoroService } from '@/serivces/Interfaces/IPomodoro.service';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import code from '@/types/http-status.enum';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class PomodoroController {
    private pomodoroService: IPomodoroService;

    constructor(
        @inject(TYPES.PomodoroService) pomodoroService: IPomodoroService
    ) {
        this.pomodoroService = pomodoroService;
    }

    public logSession = async (req: Request, res: Response): Promise<void> => {
        const userId = req.currentUser!.id; // Assumes auth middleware populates this
        const { duration, type } = req.body;

        if (!duration || !type) {
                res.status(code.BAD_REQUEST).json({ message: ErrorMessages.PomodoroRequiredFields });
                return;
        }

        const updatedLog = await this.pomodoroService.logSession(userId, { duration, type });
        res.status(code.OK).json(updatedLog);
    };

    public getDailyStats = async (req: Request, res: Response): Promise<void> => {
            const userId = req.currentUser!.id;
            const { date } = req.query;

            if (!date || typeof date !== 'string') {
                res.status(code.BAD_REQUEST).json({ message: ErrorMessages.DateRequired });
                return;
            }

            const stats = await this.pomodoroService.getStats(userId, date);
            res.status(code.OK).json(stats || {
                date,
                totalFocusTime: 0,
                totalCycles: 0,
                sessions: []
            });
    };
}
