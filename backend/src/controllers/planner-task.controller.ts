import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IPlannerTaskService } from '@/serivces/Interfaces/IPlannerTask.service';

@injectable()
export class PlannerTaskController {
    constructor(
        @inject(TYPES.PlannerTaskService)
        private _plannerTaskService: IPlannerTaskService
    ) {}

    async createTask(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const taskData = { ...req.body, userId };
        const task = await this._plannerTaskService.createTask(taskData);
        res.status(201).json(task);
    }

    async getTasks(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const tasks = await this._plannerTaskService.getTasksByUserId(userId);
        res.status(200).json(tasks);
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        const { taskId } = req.params;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const task = await this._plannerTaskService.updateTask(
            taskId,
            userId.toString(),
            req.body
        );
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(200).json(task);
    }

    async deleteTask(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        const { taskId } = req.params;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        await this._plannerTaskService.deleteTask(taskId, userId.toString());
        res.status(204).send();
    }
}
