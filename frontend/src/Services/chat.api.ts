import api from './axiosConfig';
import type { Conversation } from '@/types/chat.types';
import { ChatRoutes } from './constant.routes';

export const chatApi = {
    initiateChat: async (mentorId: string): Promise<Conversation> => {
        const response = await api.post(ChatRoutes.INITIATE, { mentorId });
        return response.data;
    },
    getConversations: async (): Promise<Conversation[]> => {
        const response = await api.get(ChatRoutes.MY_CONVERSATION);
        return response.data;
    },

    uploadFile: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(ChatRoutes.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteMessage: async (messageId: string): Promise<void> => {
        await api.delete(`${ChatRoutes.DELETE_MESSAGE}/${messageId}`);
    },
};
