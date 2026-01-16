import { IPlannerTask } from '@/models/PlannerTask.model';
import { IBaseRepository } from './IBase.repository';
import { FilterQuery } from 'mongoose';

export interface IPlannerTaskRepository extends IBaseRepository<IPlannerTask> {
    findByUserId(userId: string): Promise<IPlannerTask[]>;
}
