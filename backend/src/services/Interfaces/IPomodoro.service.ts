import { IPomodoroLog } from '@/models/pomodoro-log.model';

export interface IPomodoroService {
    logSession(
        userId: string,
        data: { duration: number; type: string }
    ): Promise<IPomodoroLog>;
    getStats(userId: string, date: string): Promise<IPomodoroLog | null>;
}
