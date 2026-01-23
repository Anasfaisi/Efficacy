import type { User, Mentor } from './auth';
export interface Message {
    _id: string;
    conversationId: string;
    senderId: string; 
    content: string;
    type: 'text' | 'image' | 'file';
    isRead: boolean;
    createdAt: string; 
}

export interface Conversation {
    _id: string;
    participants: (User | Mentor)[]; 
    lastMessage?: Message;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ChatState {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    isLoading: boolean;
    error: string | null;
}
