import { PomodoroLogModel, IPomodoroLog } from '../models/PomodoroLog.model';
import { BaseRepository } from './base.repository';
import { IPomodoroRepository } from './interfaces/IPomodoro.repository';
import { injectable } from 'inversify';
import { UpdateQuery } from 'mongoose';

@injectable()
export class PomodoroRepository extends BaseRepository<IPomodoroLog> implements IPomodoroRepository {
    constructor() {
        super(PomodoroLogModel);
    }

    async findByDate(userId: string, date: string): Promise<IPomodoroLog | null> {
        return this.model.findOne({ userId, date }).exec();
    }

    async addSession(
        userId: string, 
        date: string, 
        sessionData: { duration: number; type: 'pomodoro' | 'shortBreak' | 'longBreak'; startTime: Date; endTime: Date }
    ): Promise<IPomodoroLog> {
        const { duration, type, startTime, endTime } = sessionData;

        const update: UpdateQuery<IPomodoroLog> = {
            $push: { sessions: { startTime, endTime, duration, type } }
        };

        if (type === 'pomodoro') {
            update.$inc = { 
                totalFocusTime: duration, 
                totalCycles: 1 
            };
        } else {
             // We can track break times if we want, but schema focused on productive time
        }

        return this.model.findOneAndUpdate(
            { userId, date },
            update,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).exec() as Promise<IPomodoroLog>;
    }
}
