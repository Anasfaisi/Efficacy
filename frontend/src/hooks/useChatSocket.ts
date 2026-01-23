import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateConversationPreview, setError } from '@/redux/slices/chatSlice';
import { connectSocket } from '@/Services/socket/socketService';
import type { Message } from '@/types/chat.types';

export const useChatSocket = (roomId: string | undefined) => {
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!currentUser || !roomId) return;

        const socket = connectSocket();

        // Join the specific chat room
        const userId = currentUser.id 
        socket.emit('joinRoom', { roomId, userId });

        const handleHistory = (history: Message[]) => {
            setMessages(history);
        };

        const handleReceiveMessage = (message: Message) => {
            setMessages((prev) => [...prev, message]);
            dispatch(updateConversationPreview(message));
        };

        const handleError = (err: { message: string }) => {
            dispatch(setError(err.message));
        };

        socket.on('chatHistory', handleHistory);
        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('error', handleError);

        return () => {
            socket.off('chatHistory', handleHistory);
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('error', handleError);
        };
    }, [roomId, currentUser, dispatch]);

    const sendMessage = (content: string) => {
        const socket = connectSocket();
        if (socket && roomId && currentUser) {
            socket.emit('sendMessage', {
                roomId,
                senderId: currentUser.id,
                content
            });
        }
    };

    return { sendMessage, messages };
};
