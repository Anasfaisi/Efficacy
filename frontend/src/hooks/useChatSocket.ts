import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  connectChatSocket,
  //   disconnectChatSocket,
  joinRoom,
  leaveRoom,
  sendMessage,
  onReceiveMessage,
  onLastMessages,
  offChatEvents,
} from '@/Services/socket/chatSocketService';

import { addMessages, setMessages } from '@/redux/slices/chatSlice';
import type { ChatMessage } from '@/types/chat.types';

export const useChatSocket = (roomId: string) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const socketRef = useRef<ReturnType<typeof connectChatSocket> | null>(null);

  useEffect(() => {
    if (!user) return;

    if (!socketRef.current) {
      socketRef.current = connectChatSocket();
    }

    joinRoom(roomId, user);

    onReceiveMessage((msg: ChatMessage) => {
      dispatch(addMessages(msg));
    });

    onLastMessages((messages: ChatMessage[]) => {
      dispatch(setMessages({ roomId, messages }));
    });

    return () => {
      leaveRoom(roomId, user.id);
      offChatEvents();
    };
  }, [roomId, user, dispatch]);

  const send = (text: string) => {
    if (user) {
      sendMessage(roomId, text, user.id, user.name);
    }
  };
  return send;
};
