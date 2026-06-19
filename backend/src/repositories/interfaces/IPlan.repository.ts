import { IPlan } from '@/models/plan.model';

export interface IPlanRepository {
    createPlan(data: Partial<IPlan>): Promise<IPlan>;
    getAllPlans(
        page: number,
        limit: number,
        search?: string,
        status?: string
    ): Promise<{ data: IPlan[]; total: number }>;
    getPlanById(planId: string): Promise<IPlan | null>;
    updatePlan(planId: string, data: Partial<IPlan>): Promise<void>;
    deletePlan(planId: string, data: Partial<IPlan>): Promise<void>;
}
