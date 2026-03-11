import type { Task } from '@/Features/users/KanbanBorad/types';
import api from './axiosConfig';
import { KanbanRoutes } from './constant.routes';

export const getKanbanBoardApi = async (id: string | null) => {
    try {
        const result = await api.post(KanbanRoutes.CREATE_BOARD, { id });
        return result?.data.kanbanBoard.columns;
    } catch (error) {
        console.error(error);
    }
};

export const createTaskAPI = async (
    id: string,
    columnId: string,
    task: Task
) => {
    const res = await api.post(KanbanRoutes.CREATE_TASK, {
        id,
        columnId,
        task,
    });
    console.log(res.data.kanbanBoard.columns);
    return res.data.kanbanBoard;
};

export const updateTaskAPI = async (
    id: string,
    columnId: string,
    taskId: string,
    data: Partial<Task>
) => {
    const res = await api.put(KanbanRoutes.UPDATE_TASK, {
        id,
        columnId,
        taskId,
        data,
    });
    return res.data.kanbanBoard;
};

export const deleteKanbanTask = async (
    columnId: string,
    taskId: string,
    id: string
) => {
    const res = await api.delete(KanbanRoutes.DELETE_TASK(id), {
        data: { columnId, taskId },
    });

    return res.data.kanbanBoard;
};

export const reorderTaskAPI = async (
    id: string,
    taskId: string,
    sourceColumnId: string,
    destColumnId: string,
    sourceTaskIndex: number,
    destTaskIndex: number
) => {
    const res = await api.put(KanbanRoutes.REORDER_TASK, {
        id,
        taskId,
        sourceColumnId,
        destColumnId,
        sourceTaskIndex,
        destTaskIndex,
    });
    return res.data.kanbanBoard;
};
