import { inject, injectable, multiInject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IPlannerTask } from '@/models/PlannerTask.model';
import { IPlannerTaskRepository } from '@/repositories/interfaces/IPlannerTask.repository';
import { IPlannerTaskService } from './Interfaces/IPlannerTask.service';
import { ErrorMessages } from '@/types/response-messages.types';
import { emitGamificationEvent } from '@/utils/eventBus';
import { GamificationEvent } from '@/types/gamification.types';
import { IGamificationHandleService } from './Gamification/interfaces/IGamification-handle.service';

@injectable()
export class PlannerTaskService implements IPlannerTaskService {
    constructor(
        @inject(TYPES.PlannerTaskRepository)
        private _plannerTaskRepository: IPlannerTaskRepository,
        @multiInject(TYPES.IGamificationHandleService)
        private _taskGamificationHandler: IGamificationHandleService
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

        const wasCompleted = task.completed;
        const updatedTask = await this._plannerTaskRepository.update(
            taskId,
            taskData
        );

        if (taskData.completed === true && !wasCompleted) {
            await this._taskGamificationHandler.processAction(
                GamificationEvent.TASK_COMPLETED,
                userId
            );
        }

        return updatedTask;
    }

    // private async handleTaskCompletionGamification(userId: string) {
    //     emitGamificationEvent(GamificationEvent.TASK_COMPLETED, { userId });
    // }

    async deleteTask(taskId: string, userId: string): Promise<void> {
        const task = await this._plannerTaskRepository.findById(taskId);
        if (!task || task.userId.toString() !== userId) {
            throw new Error(ErrorMessages.TaskNotFoundOrUnauthorized);
        }
        await this._plannerTaskRepository.deleteOne(taskId);
    }
}
