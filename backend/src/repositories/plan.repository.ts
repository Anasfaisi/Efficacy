import { FilterQuery } from 'mongoose';
import { BaseRepository } from './base.repository';
import PlanModel, { IPlan } from '@/models/plan.model';
import { IPlanRepository } from './interfaces/IPlan.repository';

export class planRepository
    extends BaseRepository<IPlan>
    implements IPlanRepository
{
    constructor() {
        super(PlanModel);
    }
    async createPlan(data: Partial<IPlan>) {
        return this.create(data);
    }
    async getAllPlans(
        page: number,
        limit: number,
        search?: string,
        status?: string
    ) {
        const filter: FilterQuery<IPlan> = {};

        if (status && status !== 'all') {
            filter.isActive = status === 'active';
        }

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const searchConditions: FilterQuery<IPlan>[] = [
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
    async getPlanById(planId: string) {
        return this.findById(planId);
    }
    async updatePlan(planId: string, data: Partial<IPlan>) {
        return this.updateOne(planId, data);
    }
    async deletePlan(planId: string, data: Partial<IPlan>) {
        return this.updateOne(planId, data);
    }
}
