"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatsMapper = void 0;
const mongoose_1 = require("mongoose");
class UserStatsMapper {
    static toPersistence(data) {
        return {
            id: data.id,
            userId: new mongoose_1.Types.ObjectId(data.userId),
            tasksCompleted: data.tasksCompleted,
            taskStreakDays: data.taskStreakDays,
            pomodorosCompleted: data.pomodorosCompleted,
            focusMinutes: data.focusMinutes,
            sessionsCompleted: data.sessionsCompleted,
            lastActivityDate: data.lastActivityDate,
        };
    }
    static toEntity(data) {
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
exports.UserStatsMapper = UserStatsMapper;
//# sourceMappingURL=user-stats.mapper.js.map