import type { Task } from '@/Features/users/KanbanBorad/types';
import api from './axiosConfig';

export const getKanbanBoardApi = async (id: string | null) => {
    try {
        const result = await api.post('/kanban/board', { id });
        return result?.data.kanbanBoard.columns;
    } catch (error) {
        console.error(error);
    }
};

export const createTaskAPI = async (
    id: string,
    columnId: string,
    task: Task,
) => {
    const res = await api.post('/kanban/task/add', {
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
    data: Partial<Task>,
) => {
    const res = await api.put('/kanban/task/update', {
        id,
        columnId,
        taskId,
        data,
    });
    console.log(res.data.kanbanBoard);
    return res.data.kanbanBoard;
};

export const deleteKanbanTask = async (
    columnId: string,
    taskId: string,
    id: string,
) => {
    const res = await api.delete(`/kanban/task/${id}`, {
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
    destTaskIndex: number,
) => {
    const res = await api.put('/kanban/task/reorder', {
        id,
        taskId,
        sourceColumnId,
        destColumnId,
        sourceTaskIndex,
        destTaskIndex,
    });
    console.log(res.data, 'fxgxfgxfgx');
    return res.data.kanbanBoard;
};
