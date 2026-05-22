import { UserStatsEntity } from '@/entity/user-stats.entity';
import { IUserStats } from '@/models/UserStats.model';
import { Types } from 'mongoose';

export class UserStatsMapper {
    static toPersistence(data: Partial<UserStatsEntity>): Partial<IUserStats> {
        return {
            id: data.id,
            userId: new Types.ObjectId(data.userId),
            tasksCompleted: data.tasksCompleted,
            taskStreakDays: data.taskStreakDays,
            pomodorosCompleted: data.pomodorosCompleted,
            focusMinutes: data.focusMinutes,
            sessionsCompleted: data.sessionsCompleted,
            lastActivityDate: data.lastActivityDate,
        };
    }

    static toEntity(data: IUserStats): UserStatsEntity {
        return {
            id: data.id,
            userId: data.userId.toString(),
            tasksCompleted: data.tasksCompleted,
            taskStreakDays: data.taskStreakDays,
            pomodorosCompleted: data.pomodorosCompleted,
            focusMinutes: data.focusMinutes,
            sessionsCompleted: data.sessionsCompleted,
            lastActivityDate: data.lastActivityDate,
        };
    }
}
