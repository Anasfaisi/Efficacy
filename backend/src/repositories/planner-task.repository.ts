import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import { IPlannerTask } from '@/models/planner-task.model';
import PlannerTasks from '@/models/planner-task.model';
import { IPlannerTaskRepository } from './interfaces/IPlannerTask.repository';

@injectable()
export class PlannerTaskRepository
    extends BaseRepository<IPlannerTask>
    implements IPlannerTaskRepository
{
    constructor() {
        super(PlannerTasks);
    }

    async findByUserId(userId: string): Promise<IPlannerTask[]> {
        return this.model.find({ userId }).sort({ startDate: 1 }).exec();
    }
}
