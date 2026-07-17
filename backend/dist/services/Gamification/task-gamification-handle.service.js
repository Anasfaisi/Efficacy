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
exports.TaskGamificationHandleService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let TaskGamificationHandleService = class TaskGamificationHandleService {
    _userStatsRepo;
    _dailyStreakCalculator;
    _badgeGamficationService;
    constructor(_userStatsRepo, _dailyStreakCalculator, _badgeGamficationService) {
        this._userStatsRepo = _userStatsRepo;
        this._dailyStreakCalculator = _dailyStreakCalculator;
        this._badgeGamficationService = _badgeGamficationService;
    }
    async processAction(event, userId) {
        let stats = await this._userStatsRepo.FindByUserId(userId);
        if (!stats)
            stats = await this._userStatsRepo.CreateUserStats({
                userId: userId,
                lastActivityDate: new Date(),
            });
        stats.tasksCompleted += 1;
        const updatedStats = await this._dailyStreakCalculator.calculateDailyStreak(stats);
        const savedStats = await this._userStatsRepo.UpdateUserStats(updatedStats.id, updatedStats);
        if (!savedStats)
            throw new Error(response_messages_types_1.ErrorMessages.UserStatsNotFound);
        await this._badgeGamficationService.evaluate(event, savedStats);
    }
};
exports.TaskGamificationHandleService = TaskGamificationHandleService;
exports.TaskGamificationHandleService = TaskGamificationHandleService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserStatsRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.DailyStreakCalculator)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BadgeGamficationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], TaskGamificationHandleService);
//# sourceMappingURL=task-gamification-handle.service.js.map