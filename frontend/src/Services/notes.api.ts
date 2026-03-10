import api from '@/Services/axiosConfig';
import type { INote, CreateNoteDTO } from '@/Features/users/notes/types';
import { NoteRoutes } from '@/Services/constant.routes';

export const getNotesApi = async (): Promise<INote[]> => {
    const response = await api.get(NoteRoutes.GET_NOTES);
    return response.data;
};

export const createNoteApi = async (data: CreateNoteDTO): Promise<INote> => {
    const response = await api.post(NoteRoutes.CREATE_NOTE, data);
    return response.data;
};

export const updateNoteApi = async (
    id: string,
    data: Partial<INote>
): Promise<INote> => {
    const response = await api.put(NoteRoutes.UPDATE_NOTE(id), data);
    return response.data;
};

export const deleteNoteApi = async (id: string): Promise<void> => {
    await api.delete(NoteRoutes.DELETE_NOTE(id));
};
