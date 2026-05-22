import { TYPES } from '@/config/inversify-key.types';
import { IPlanService } from '@/serivces/Interfaces/IPlan.service';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import httpStatus from '@/types/http-status.enum';
import { FilterQuery } from 'mongoose';
import { IPlan } from '@/models/Plan.model';
@injectable()
export class PlanController {
    constructor(
        @inject(TYPES.PlanService) private _planService: IPlanService
    ) {}
    async createPlan(req: Request, res: Response) {
        const result = await this._planService.createPlan(req.body);
        res.status(httpStatus.OK).json(result);
    }
    async getAllPlans(req: Request, res: Response) {
        const { search = '', status = 'all' } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await this._planService.getAllPlans(
            page,
            limit,
            search as string,
            status as string
        );
        res.status(httpStatus.OK).json(result);
    }
    async getPlanById(req: Request, res: Response) {
        const result = await this._planService.getPlanById(req.params.planId);
        res.status(httpStatus.OK).json(result);
    }
    async updatePlan(req: Request, res: Response) {
        await this._planService.updatePlan(req.params.planId, req.body);
        res.status(httpStatus.OK).json({
            message: 'Plan updated successfully',
        });
    }
    async deletePlan(req: Request, res: Response) {
        await this._planService.deletePlan(req.params.planId, req.body);
        res.status(httpStatus.OK).json({
            message: 'Plan deleted successfully',
        });
    }
}
