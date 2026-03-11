import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IPlannerTask } from '@/models/PlannerTask.model';
import { IPlannerTaskRepository } from '@/repositories/interfaces/IPlannerTask.repository';
import { IPlannerTaskService } from './Interfaces/IPlannerTask.service';
import { ErrorMessages } from '@/types/response-messages.types';
import { UserStats } from '@/models/UserStats.model';
import { emitGamificationEvent } from '@/utils/eventBus';
import { GamificationEvent } from '@/types/gamification.types';

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

        const wasCompleted = task.completed;
        const updatedTask = await this._plannerTaskRepository.update(
            taskId,
            taskData
        );

        if (taskData.completed === true && !wasCompleted) {
            this.handleTaskCompletionGamification(userId).catch((err) =>
                console.error('Gamification task hook failed:', err)
            );
        }

        return updatedTask;
    }

    private async handleTaskCompletionGamification(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let stats = await UserStats.findOne({ userId });
        if (!stats) {
            stats = await UserStats.create({
                userId,
                tasksCompleted: 0,
                pomodorosCompleted: 0,
                focusMinutes: 0,
                sessionsCompleted: 0,
                taskStreakDays: 0,
            });
        }

        let newStreak = stats.taskStreakDays || 0;
        const lastActivity = stats.lastActivityDate;

        if (lastActivity) {
            const lastData = new Date(lastActivity);
            lastData.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(today.getTime() - lastData.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak += 1;
            } else if (diffDays > 1) {
                newStreak = 1;
            } else if (diffDays === 0 && newStreak === 0) {
                newStreak = 1;
            }
        } else {
            newStreak = 1;
        }

        stats.tasksCompleted += 1;
        stats.taskStreakDays = newStreak;
        stats.lastActivityDate = new Date();

        await stats.save();

        emitGamificationEvent(GamificationEvent.TASK_COMPLETED, { userId });
        emitGamificationEvent(GamificationEvent.STREAK_UPDATED, { userId });
    }

    async deleteTask(taskId: string, userId: string): Promise<void> {
        const task = await this._plannerTaskRepository.findById(taskId);
        if (!task || task.userId.toString() !== userId) {
            throw new Error(ErrorMessages.TaskNotFoundOrUnauthorized);
        }
        await this._plannerTaskRepository.deleteOne(taskId);
    }
}
