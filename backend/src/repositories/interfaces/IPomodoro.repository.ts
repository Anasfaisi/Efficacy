import { IPomodoroLog } from "@/models/PomodoroLog.model";
import { IBaseRepository } from "./IBase.repository";

export interface IPomodoroRepository extends IBaseRepository<IPomodoroLog> {
    findByDate(userId: string, date: string): Promise<IPomodoroLog | null>;
    addSession(
        userId: string, 
        date: string, 
        sessionData: { duration: number; type: 'pomodoro' | 'shortBreak' | 'longBreak'; startTime: Date; endTime: Date }
    ): Promise<IPomodoroLog>;
}
