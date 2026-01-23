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
    }
};
