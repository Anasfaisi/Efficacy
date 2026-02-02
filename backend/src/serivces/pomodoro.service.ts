import { PomodoroRepository } from '../repositories/pomodoro.repository';
import { IPomodoroLog } from '../models/PomodoroLog.model';
import { IPomodoroService } from './Interfaces/IPomodoro.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IPomodoroRepository } from '@/repositories/interfaces/IPomodoro.repository';

@injectable()
export class PomodoroService implements IPomodoroService {
    private pomodoroRepository: IPomodoroRepository;

    constructor(
        @inject(TYPES.PomodoroRepository) pomodoroRepository: IPomodoroRepository
    ) {
        this.pomodoroRepository = pomodoroRepository;
    }

    async logSession(userId: string, data: { duration: number; type: string }): Promise<IPomodoroLog> {
        const { duration, type } = data;
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        
        // Calculate start time based on duration (approximate is fine for logs, or pass strictly if needed)
        // Note: duration is in seconds
        const startTime = new Date(now.getTime() - duration * 1000);
        
        return this.pomodoroRepository.addSession(userId, date, {
            duration,
            type: type as 'pomodoro' | 'shortBreak' | 'longBreak',
            startTime,
            endTime: now
        });
    }

    async getStats(userId: string, date: string): Promise<IPomodoroLog | null> {
        return this.pomodoroRepository.findByDate(userId, date);
    }
}
