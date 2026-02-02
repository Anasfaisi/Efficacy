import api from '@/Services/axiosConfig';
import type { INote, CreateNoteDTO } from '@/Features/users/notes/types';

export const getNotesApi = async (): Promise<INote[]> => {
    const response = await api.get('/notes');
    return response.data;
};

export const createNoteApi = async (data: CreateNoteDTO): Promise<INote> => {
    const response = await api.post('/notes', data);
    return response.data;
};

export const updateNoteApi = async (id: string, data: Partial<INote>): Promise<INote> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
};

export const deleteNoteApi = async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
};
