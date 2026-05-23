import { inject, injectable } from 'inversify';
import { IPlanService } from './Interfaces/IPlan.service';
import { TYPES } from '@/config/inversify-key.types';
import { IPlanRepository } from '@/repositories/interfaces/IPlan.repository';
import { planMapper } from '@/Mapper/plan.mapper';
import { createPlanRequestDto, createPlanResponseDto } from '@/dto/plan.dto';
import { IPlan } from '@/models/plan.model';

@injectable()
export class PlanService implements IPlanService {
    constructor(
        @inject(TYPES.planRepository) private _planRepository: IPlanRepository
    ) {}

    async createPlan(
        data: createPlanRequestDto
    ): Promise<createPlanResponseDto> {
        const result = await this._planRepository.createPlan(data);
        return planMapper.ToResponse(result);
    }

    async getAllPlans(
        page: number,
        limit: number,
        search?: string,
        status?: string
    ): Promise<{ data: createPlanResponseDto[]; total: number }> {
        const result = await this._planRepository.getAllPlans(
            page,
            limit,
            search,
            status
        );
        return {
            data: result.data.map(planMapper.ToResponse),
            total: result.total,
        };
    }
    async getPlanById(planId: string): Promise<createPlanResponseDto> {
        const result = await this._planRepository.getPlanById(planId);
        if (!result) {
            throw new Error('Plan not found');
        }
        return planMapper.ToResponse(result);
    }
    async updatePlan(planId: string, data: Partial<IPlan>): Promise<void> {
        await this._planRepository.updatePlan(planId, data);
    }
    async deletePlan(planId: string, data: Partial<IPlan>): Promise<void> {
        await this._planRepository.deletePlan(planId, data);
    }
}
