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
exports.PlannerTaskService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
const gamification_types_1 = require("@/types/gamification.types");
let PlannerTaskService = class PlannerTaskService {
    _plannerTaskRepository;
    _taskGamificationHandler;
    constructor(_plannerTaskRepository, _taskGamificationHandler) {
        this._plannerTaskRepository = _plannerTaskRepository;
        this._taskGamificationHandler = _taskGamificationHandler;
    }
    async createTask(taskData) {
        return this._plannerTaskRepository.create(taskData);
    }
    async getTasksByUserId(userId) {
        return this._plannerTaskRepository.findByUserId(userId);
    }
    async updateTask(taskId, userId, taskData) {
        const task = await this._plannerTaskRepository.findById(taskId);
        if (!task || task.userId.toString() !== userId) {
            return null;
        }
        const wasCompleted = task.completed;
        const updatedTask = await this._plannerTaskRepository.update(taskId, taskData);
        if (taskData.completed === true && !wasCompleted) {
            await this._taskGamificationHandler.processAction(gamification_types_1.GamificationEvent.TASK_COMPLETED, userId);
        }
        return updatedTask;
    }
    async deleteTask(taskId, userId) {
        const task = await this._plannerTaskRepository.findById(taskId);
        if (!task || task.userId.toString() !== userId) {
            throw new Error(response_messages_types_1.ErrorMessages.TaskNotFoundOrUnauthorized);
        }
        await this._plannerTaskRepository.deleteOne(taskId);
    }
};
exports.PlannerTaskService = PlannerTaskService;
exports.PlannerTaskService = PlannerTaskService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PlannerTaskRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.TaskGamificationHandler)),
    __metadata("design:paramtypes", [Object, Object])
], PlannerTaskService);
//# sourceMappingURL=planner-task.service.js.map