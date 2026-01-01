import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  connectSocket,
  joinRoom,
  leaveRoom,
  sendMessage,
  onReceiveMessage,
  onLastMessages,
  offChatEvents,
} from '@/Services/socket/socketService';


import { addMessages, setMessages } from '@/redux/slices/chatSlice';
import type { ChatMessage } from '@/types/chat.types';

export const useChatSocket = (roomId: string) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    if (!socketRef.current) {
      socketRef.current = connectSocket();
    }

    joinRoom(roomId, currentUser as any);

    onReceiveMessage((msg: ChatMessage) => {
      dispatch(addMessages(msg));
    });

    onLastMessages((messages: ChatMessage[]) => {
      dispatch(setMessages({ roomId, messages }));
    });

    return () => {
      leaveRoom(roomId, currentUser.id!);
      offChatEvents();
    };
  }, [roomId, currentUser, dispatch]);

  const send = (text: string) => {
    if (currentUser) {
      const name = (currentUser as any).name || (currentUser as any).email || 'Admin';
      sendMessage(roomId, text, currentUser.id!, name);
    }
  };
  return send;
};
