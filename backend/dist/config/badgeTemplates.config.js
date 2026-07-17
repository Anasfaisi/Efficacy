"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeTemplates = void 0;
const gamification_types_1 = require("../types/gamification.types");
exports.badgeTemplates = {
    [gamification_types_1.BadgeTemplate.TASK_COUNT]: {
        template: gamification_types_1.BadgeTemplate.TASK_COUNT,
        metric: 'tasksCompleted',
        operator: '>=',
        triggerEvent: gamification_types_1.GamificationEvent.TASK_COMPLETED,
    },
    [gamification_types_1.BadgeTemplate.TASK_STREAK]: {
        template: gamification_types_1.BadgeTemplate.TASK_STREAK,
        metric: 'taskStreakDays',
        operator: '>=',
        triggerEvent: gamification_types_1.GamificationEvent.STREAK_UPDATED,
    },
    [gamification_types_1.BadgeTemplate.POMODORO_COUNT]: {
        template: gamification_types_1.BadgeTemplate.POMODORO_COUNT,
        metric: 'pomodorosCompleted',
        operator: '>=',
        triggerEvent: gamification_types_1.GamificationEvent.POMODORO_COMPLETED,
    },
    [gamification_types_1.BadgeTemplate.FOCUS_TIME]: {
        template: gamification_types_1.BadgeTemplate.FOCUS_TIME,
        metric: 'focusMinutes',
        operator: '>=',
        triggerEvent: gamification_types_1.GamificationEvent.FOCUS_TIME_UPDATED,
    },
    [gamification_types_1.BadgeTemplate.SESSION_COUNT]: {
        template: gamification_types_1.BadgeTemplate.SESSION_COUNT,
        metric: 'sessionsCompleted',
        operator: '>=',
        triggerEvent: gamification_types_1.GamificationEvent.SESSION_COMPLETED,
    },
};
//# sourceMappingURL=badgeTemplates.config.js.map