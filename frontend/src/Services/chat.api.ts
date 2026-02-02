import api from './axiosConfig'; 
import type { Conversation, Message } from '@/types/chat.types';

export const chatApi = {
    initiateChat: async (mentorId: string): Promise<Conversation> => {
        const response = await api.post('/chat/initiate', { mentorId });
        return response.data;
    },
    getConversations: async (): Promise<Conversation[]> => {
        const response = await api.get('/chat/my-conversations');
        return response.data;
    },

    getMessages: async (roomId: string): Promise<Message[]> => {
        const response = await api.get(`/chat/${roomId}/messages`);
        return response.data;
    },

    uploadFile: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/chat/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteMessage: async (messageId: string): Promise<void> => {
        await api.delete(`/chat/messages/${messageId}`);
    }
};
