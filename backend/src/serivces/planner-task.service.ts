import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IPlannerTask } from '@/models/PlannerTask.model';
import { IPlannerTaskRepository } from '@/repositories/interfaces/IPlannerTask.repository';
import { IPlannerTaskService } from './Interfaces/IPlannerTask.service';

@injectable()
export class PlannerTaskService implements IPlannerTaskService {
    constructor(
        @inject(TYPES.PlannerTaskRepository)
        private _plannerTaskRepository: IPlannerTaskRepository
    ) {}

    async createTask(taskData: Partial<IPlannerTask>): Promise<IPlannerTask> {
        return this._plannerTaskRepository.create(taskData);
    }

    async getTasksByUserId(userId: string): Promise<IPlannerTask[]> {
        return this._plannerTaskRepository.findByUserId(userId);
    }

    async updateTask(
        taskId: string,
        userId: string,
        taskData: Partial<IPlannerTask>
    ): Promise<IPlannerTask | null> {
        const task = await this._plannerTaskRepository.findById(taskId);
        if (!task || task.userId.toString() !== userId) {
            return null;
        }
        return this._plannerTaskRepository.update(taskId, taskData);
    }

    async deleteTask(taskId: string, userId: string): Promise<void> {
        const task = await this._plannerTaskRepository.findById(taskId);
        if (!task || task.userId.toString() !== userId) {
            throw new Error('Task not found or unauthorized');
        }
        await this._plannerTaskRepository.deleteOne(taskId);
    }
}
