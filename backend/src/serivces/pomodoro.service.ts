import { IPomodoroLog } from '../models/PomodoroLog.model';
import { IPomodoroService } from './Interfaces/IPomodoro.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IPomodoroRepository } from '@/repositories/interfaces/IPomodoro.repository';
import { UserStats } from '@/models/UserStats.model';
import { emitGamificationEvent } from '@/utils/eventBus';
import { GamificationEvent } from '@/types/gamification.types';
import { IPomodoroGamificationService } from './Gamification/interfaces/IPomodoro-gamification.service';

@injectable()
export class PomodoroService implements IPomodoroService {
    constructor(
        @inject(TYPES.PomodoroRepository)
        private _pomodoroRepository: IPomodoroRepository,
        @inject(TYPES.PomodoroGamificationService)
        private _pomodoroGamificationService: IPomodoroGamificationService
    ) {}

    async logSession(
        userId: string,
        data: { duration: number; type: string }
    ): Promise<IPomodoroLog> {
        const { duration, type } = data;
        const now = new Date();
        const date = now.toISOString().split('T')[0];

        const startTime = new Date(now.getTime() - duration * 1000);

        const log = await this._pomodoroRepository.addSession(userId, date, {
            duration,
            type: type as 'pomodoro' | 'shortBreak' | 'longBreak',
            startTime,
            endTime: now,
        });
        if (type === 'pomodoro') {
            // here we pass userid and gamification event instead of focus time
            await this._pomodoroGamificationService.handlePomodoroCompletion(
                GamificationEvent.POMODORO_COMPLETED,
                userId
            );
        }

        return log;
    }

    private async handlePomodoroCompletionGamification(
        userId: string,
        minutes: number
    ) {
        let stats = await UserStats.findOne({ userId });
        if (!stats) {
            stats = await UserStats.create({
                userId,
                tasksCompleted: 0,
                pomodorosCompleted: 0,
                focusMinutes: 0,
                sessionsCompleted: 0,
                taskStreakDays: 0,
            });
        }

        stats.pomodorosCompleted += 1;
        stats.focusMinutes += minutes;
        await stats.save();

        emitGamificationEvent(GamificationEvent.POMODORO_COMPLETED, { userId });
        emitGamificationEvent(GamificationEvent.FOCUS_TIME_UPDATED, { userId });
    }

    async getStats(userId: string, date: string): Promise<IPomodoroLog | null> {
        return this._pomodoroRepository.findByDate(userId, date);
    }
}
