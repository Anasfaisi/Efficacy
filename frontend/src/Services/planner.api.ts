import api from './axiosConfig';
import type { IPlannerTask } from '@/Features/users/planner/types';

export const createPlannerTask = async (
    taskData: Partial<IPlannerTask>,
): Promise<IPlannerTask> => {
    const response = await api.post('/planner', taskData);
    return response.data;
};

export const getPlannerTasks = async (): Promise<IPlannerTask[]> => {
    const response = await api.get('/planner');
    return response.data;
};

export const updatePlannerTask = async (
    taskId: string,
    taskData: Partial<IPlannerTask>,
): Promise<IPlannerTask> => {
    const response = await api.put(`/planner/${taskId}`, taskData);
    return response.data;
};

export const deletePlannerTask = async (taskId: string): Promise<void> => {
    await api.delete(`/planner/${taskId}`);
};
