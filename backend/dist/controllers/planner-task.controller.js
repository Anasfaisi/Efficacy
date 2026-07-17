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
exports.PlannerTaskController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let PlannerTaskController = class PlannerTaskController {
    _plannerTaskService;
    constructor(_plannerTaskService) {
        this._plannerTaskService = _plannerTaskService;
    }
    async createTask(req, res) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.Unauthorized,
            });
            return;
        }
        const taskData = { ...req.body, userId };
        const task = await this._plannerTaskService.createTask(taskData);
        res.status(201 /* code.CREATED */).json(task);
    }
    async getTasks(req, res) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.Unauthorized,
            });
            return;
        }
        const tasks = await this._plannerTaskService.getTasksByUserId(userId);
        res.status(200 /* code.OK */).json(tasks);
    }
    async updateTask(req, res) {
        const userId = req.currentUser?.id;
        const { taskId } = req.params;
        if (!userId) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.Unauthorized,
            });
            return;
        }
        const task = await this._plannerTaskService.updateTask(taskId, userId.toString(), req.body);
        if (!task) {
            res.status(404 /* code.NOT_FOUND */).json({
                message: response_messages_types_1.ErrorMessages.TaskNotFound,
            });
            return;
        }
        res.status(200 /* code.OK */).json(task);
    }
    async deleteTask(req, res) {
        const userId = req.currentUser?.id;
        const { taskId } = req.params;
        if (!userId) {
            res.status(401 /* code.UNAUTHORIZED */).json({ message: 'Unauthorized' });
            return;
        }
        await this._plannerTaskService.deleteTask(taskId, userId.toString());
        res.status(204 /* code.NO_CONTENT */).send();
    }
};
exports.PlannerTaskController = PlannerTaskController;
exports.PlannerTaskController = PlannerTaskController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PlannerTaskService)),
    __metadata("design:paramtypes", [Object])
], PlannerTaskController);
//# sourceMappingURL=planner-task.controller.js.map