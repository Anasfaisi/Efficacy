import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, Conversation, Message } from '@/types/chat.types';

const initialState: ChatState = {
    conversations: [],
    currentConversation: null,
    isLoading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConversations(state, action: PayloadAction<Conversation[]>) {
            state.conversations = action.payload;
        },
        setCurrentConversation(state, action: PayloadAction<Conversation | null>) {
            state.currentConversation = action.payload;
        },
        updateConversationPreview(state, action: PayloadAction<Message>) {
            const conversationIndex = state.conversations.findIndex(c => c._id === action.payload.conversationId);
            if (conversationIndex !== -1) {
                const conversation = state.conversations[conversationIndex];
                conversation.lastMessage = action.payload;
                conversation.updatedAt = action.payload.createdAt;
                
                // Move this conversation to the top
                state.conversations.splice(conversationIndex, 1);
                state.conversations.unshift(conversation);
            }
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        }
    },
});

export const { 
    setConversations, 
    setCurrentConversation, 
    updateConversationPreview,
    setLoading, 
    setError 
} = chatSlice.actions;

export default chatSlice.reducer;
