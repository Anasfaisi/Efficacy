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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannerTaskRepository = void 0;
const inversify_1 = require("inversify");
const base_repository_1 = require("./base.repository");
const planner_task_model_1 = __importDefault(require("@/models/planner-task.model"));
let PlannerTaskRepository = class PlannerTaskRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(planner_task_model_1.default);
    }
    async findByUserId(userId) {
        return this.model.find({ userId }).sort({ startDate: 1 }).exec();
    }
};
exports.PlannerTaskRepository = PlannerTaskRepository;
exports.PlannerTaskRepository = PlannerTaskRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PlannerTaskRepository);
//# sourceMappingURL=planner-task.repository.js.map