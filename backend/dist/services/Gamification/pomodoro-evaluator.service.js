"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroEvaluator = void 0;
const gamification_types_1 = require("@/types/gamification.types");
class PomodoroEvaluator {
    badgeTemplateEvent = gamification_types_1.BadgeTemplate.POMODORO_COUNT;
    constructor() { }
    evaulate(data) {
        return data.userStats.pomodorosCompleted >= data.badge.threshold;
    }
}
exports.PomodoroEvaluator = PomodoroEvaluator;
//# sourceMappingURL=pomodoro-evaluator.service.js.map