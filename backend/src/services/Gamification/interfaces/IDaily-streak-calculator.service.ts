import { UserStatsEntity } from '@/entity/user-stats.entity';

export interface IDailyStreakCalculator {
    calculateDailyStreak(userStats: UserStatsEntity): Promise<UserStatsEntity>;
}
