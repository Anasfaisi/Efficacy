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
exports.PlanService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const plan_mapper_1 = require("@/Mapper/plan.mapper");
let PlanService = class PlanService {
    _planRepository;
    constructor(_planRepository) {
        this._planRepository = _planRepository;
    }
    async createPlan(data) {
        const result = await this._planRepository.createPlan(data);
        return plan_mapper_1.planMapper.ToResponse(result);
    }
    async getAllPlans(page, limit, search, status) {
        const result = await this._planRepository.getAllPlans(page, limit, search, status);
        return {
            data: result.data.map(plan_mapper_1.planMapper.ToResponse),
            total: result.total,
        };
    }
    async getPlanById(planId) {
        const result = await this._planRepository.getPlanById(planId);
        if (!result) {
            throw new Error('Plan not found');
        }
        return plan_mapper_1.planMapper.ToResponse(result);
    }
    async updatePlan(planId, data) {
        await this._planRepository.updatePlan(planId, data);
    }
    async deletePlan(planId, data) {
        await this._planRepository.deletePlan(planId, data);
    }
};
exports.PlanService = PlanService;
exports.PlanService = PlanService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.planRepository)),
    __metadata("design:paramtypes", [Object])
], PlanService);
//# sourceMappingURL=plan.service.js.map