import api from './axiosConfig';

export const getKanbanBoard = async (id: string|null) => {
  try {
    const result = await api.post('/kanban/board', { id });
    console.log(result.data.kanbanBoard.columns,"hhhuhuh=====");
    return result?.data.kanbanBoard.columns;
  } catch (error) {
    console.error(error);
  }
};
