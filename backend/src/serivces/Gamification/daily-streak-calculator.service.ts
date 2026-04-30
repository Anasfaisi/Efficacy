import { UserStatsEntity } from "@/entity/user-stats.entity";
import { IDailyStreakCalculator } from "./interfaces/IDaily-streak-calculator.service";

export class DailyStreakCalculator implements IDailyStreakCalculator {
    async calculateDailyStreak(userStats: UserStatsEntity): Promise<UserStatsEntity> {
        let streak = userStats.taskStreakDays;
        const today = new Date();
        const lastActivity = userStats.lastActivityDate;
        if(lastActivity){
            const lastData = new Date(lastActivity)
            lastData.setHours(0,0,0,0);
            const diffTime = Math.abs(today.getTime() - lastData.getTime())
            const diffDays = Math.ceil(diffTime/(1000*60*60*24))
            if(diffDays === 1){
                streak += 1;
            }else if(diffDays > 1){
                streak = 1;
            }else if(diffDays === 0 && streak === 0){
                streak = 1;
            }
        }else{
            streak = 1;
        }
        userStats.taskStreakDays = streak
        userStats.lastActivityDate = today;
        return userStats
    }
}