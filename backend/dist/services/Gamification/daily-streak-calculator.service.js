"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyStreakCalculator = void 0;
class DailyStreakCalculator {
    async calculateDailyStreak(userStats) {
        let streak = userStats.taskStreakDays;
        const today = new Date();
        const lastActivity = userStats.lastActivityDate;
        if (lastActivity) {
            const lastData = new Date(lastActivity);
            lastData.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(today.getTime() - lastData.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak += 1;
            }
            else if (diffDays > 1) {
                streak = 1;
            }
            else if (diffDays === 0 && streak === 0) {
                streak = 1;
            }
        }
        else {
            streak = 1;
        }
        userStats.taskStreakDays = streak;
        userStats.lastActivityDate = today;
        return userStats;
    }
}
exports.DailyStreakCalculator = DailyStreakCalculator;
//# sourceMappingURL=daily-streak-calculator.service.js.map