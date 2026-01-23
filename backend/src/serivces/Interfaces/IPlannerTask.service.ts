import { IPlannerTask } from '@/models/PlannerTask.model';

export interface IPlannerTaskService {
    createTask(taskData: Partial<IPlannerTask>): Promise<IPlannerTask>;
    getTasksByUserId(userId: string): Promise<IPlannerTask[]>;
    updateTask(
        taskId: string,
        userId: string,
        taskData: Partial<IPlannerTask>
    ): Promise<IPlannerTask | null>;
    deleteTask(taskId: string, userId: string): Promise<void>;
}
