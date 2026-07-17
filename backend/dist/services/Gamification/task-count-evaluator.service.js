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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCountEvaluator = void 0;
const gamification_types_1 = require("@/types/gamification.types");
const inversify_1 = require("inversify");
let TaskCountEvaluator = class TaskCountEvaluator {
    badgeTemplateEvent = gamification_types_1.BadgeTemplate.TASK_COUNT;
    constructor() { }
    evaulate(data) {
        return data.userStats.tasksCompleted >= data.badge.threshold;
    }
};
exports.TaskCountEvaluator = TaskCountEvaluator;
exports.TaskCountEvaluator = TaskCountEvaluator = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TaskCountEvaluator);
//# sourceMappingURL=task-count-evaluator.service.js.map