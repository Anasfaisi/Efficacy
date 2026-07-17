"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planRepository = void 0;
const base_repository_1 = require("./base.repository");
const plan_model_1 = __importDefault(require("@/models/plan.model"));
class planRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(plan_model_1.default);
    }
    async createPlan(data) {
        return this.create(data);
    }
    async getAllPlans(page, limit, search, status) {
        const filter = {};
        if (status && status !== 'all') {
            filter.isActive = status === 'active';
        }
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const searchConditions = [
                { name: searchRegex },
                { features: searchRegex },
            ];
            if (!isNaN(Number(search))) {
                searchConditions.push({ price: Number(search) });
            }
            filter.$or = searchConditions;
        }
        return this.findWithPagination(filter, page, limit);
    }
    async getPlanById(planId) {
        return this.findById(planId);
    }
    async updatePlan(planId, data) {
        return this.updateOne(planId, data);
    }
    async deletePlan(planId, data) {
        return this.updateOne(planId, data);
    }
}
exports.planRepository = planRepository;
//# sourceMappingURL=plan.repository.js.map