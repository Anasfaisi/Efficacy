import api from './axiosConfig';
import type { IPlannerTask } from '@/Features/users/planner/types';
import { PlannerRoutes } from './constant.routes';

export const createPlannerTask = async (
    taskData: Partial<IPlannerTask>
): Promise<IPlannerTask> => {
    const response = await api.post(PlannerRoutes.BASE, taskData);
    return response.data;
};

export const getPlannerTasks = async (): Promise<IPlannerTask[]> => {
    const response = await api.get('/planner');
    return response.data;
};

export const updatePlannerTask = async (
    taskId: string,
    taskData: Partial<IPlannerTask>
): Promise<IPlannerTask> => {
    const response = await api.put(PlannerRoutes.UPDATE_TASK(taskId), taskData);
    return response.data;
};

export const deletePlannerTask = async (taskId: string): Promise<void> => {
    await api.delete(PlannerRoutes.DELETE_TASK(taskId));
};
