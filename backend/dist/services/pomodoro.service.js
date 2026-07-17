"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const user_stats_model_1 = require("@/models/user-stats.model");
const eventBus_1 = require("@/utils/eventBus");
const gamification_types_1 = require("@/types/gamification.types");
let PomodoroService = class PomodoroService {
    _pomodoroRepository;
    _pomodoroGamificationService;
    constructor(_pomodoroRepository, _pomodoroGamificationService) {
        this._pomodoroRepository = _pomodoroRepository;
        this._pomodoroGamificationService = _pomodoroGamificationService;
    }
    async logSession(userId, data) {
        const { duration, type } = data;
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const startTime = new Date(now.getTime() - duration * 1000);
        const log = await this._pomodoroRepository.addSession(userId, date, {
            duration,
            type: type,
            startTime,
            endTime: now,
        });
        if (type === 'pomodoro') {
            // here we pass userid and gamification event instead of focus time
            await this._pomodoroGamificationService.handlePomodoroCompletion(gamification_types_1.GamificationEvent.POMODORO_COMPLETED, userId);
        }
        return log;
    }
    async handlePomodoroCompletionGamification(userId, minutes) {
        let stats = await user_stats_model_1.UserStats.findOne({ userId });
        if (!stats) {
            stats = await user_stats_model_1.UserStats.create({
                userId,
                tasksCompleted: 0,
                pomodorosCompleted: 0,
                focusMinutes: 0,
                sessionsCompleted: 0,
                taskStreakDays: 0,
            });
        }
        stats.pomodorosCompleted += 1;
        stats.focusMinutes += minutes;
        await stats.save();
        (0, eventBus_1.emitGamificationEvent)(gamification_types_1.GamificationEvent.POMODORO_COMPLETED, { userId });
        (0, eventBus_1.emitGamificationEvent)(gamification_types_1.GamificationEvent.FOCUS_TIME_UPDATED, { userId });
    }
    async getStats(userId, date) {
        return this._pomodoroRepository.findByDate(userId, date);
    }
};
exports.PomodoroService = PomodoroService;
exports.PomodoroService = PomodoroService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PomodoroRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PomodoroGamificationService)),
    __metadata("design:paramtypes", [Object, Object])
], PomodoroService);
//# sourceMappingURL=pomodoro.service.js.map