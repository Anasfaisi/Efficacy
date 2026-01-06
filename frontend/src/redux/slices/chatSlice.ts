import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage, ChatState } from '@/types/chat.types';

const initialState: ChatState = {
    currentRoomId: null,
    messages: {},
    isLoading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentRoom(state, action: PayloadAction<string>) {
            state.currentRoomId = action.payload;
        },
        setMessages(
            state,
            action: PayloadAction<{ roomId: string; messages: ChatMessage[] }>,
        ) {
            state.messages[action.payload.roomId] = action.payload.messages;
        },
        addMessages(state, action: PayloadAction<ChatMessage>) {
            const { roomId } = action.payload;
            if (!state.messages[roomId]) {
                state.messages[roomId] = [];
            }
            state.messages[roomId].push(action.payload);
        },

        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

export const { setCurrentRoom, setMessages, addMessages, setError } =
    chatSlice.actions;
export default chatSlice.reducer;
