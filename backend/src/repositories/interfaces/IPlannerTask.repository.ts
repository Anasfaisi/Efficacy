import { IPlannerTask } from '@/models/planner-task.model';
import { IBaseRepository } from './IBase.repository';

export interface IPlannerTaskRepository extends IBaseRepository<IPlannerTask> {
    findByUserId(userId: string): Promise<IPlannerTask[]>;
}
