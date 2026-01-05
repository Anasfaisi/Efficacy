import { io, Socket } from 'socket.io-client';
import type { currentUserType } from '@/types/auth';

import type { ChatMessage } from '@/types/chat.types';
import type { Notification } from '@/Features/admin/types';

let socket: Socket | null = null;

const getSocketUrl = () => {
  const apiUrl =
    import.meta.env.VITE_API_URL_SOCKET || import.meta.env.VITE_API_URL;
  if (!apiUrl) return 'http://localhost:5000';

  try {
    const url = new URL(apiUrl);
    return url.origin;
  } catch {
    if (apiUrl.includes(':') && !apiUrl.startsWith('http')) {
      return `http://${apiUrl}`;
    }
    return 'http://localhost:5000';
  }
};

const SOCKET_URL = getSocketUrl();
console.log('Socket initialized with URL:', SOCKET_URL);

export const connectSocket = () => {
  if (!socket) {
    console.log('Connecting to socket at:', SOCKET_URL);
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      socket = null;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const joinRoleRoom = (role: string) => {
  socket?.emit('joinRoleRoom', role);
};

export const joinRoom = (roomId: string, user: currentUserType) => {
  socket?.emit('joinRoom', { roomId, user });
};

export const leaveRoom = (roomId: string, userId: string) => {
  socket?.emit('leaveRoom', { roomId, userId });
};

export const sendMessage = (
  roomId: string,
  message: string,
  senderId: string,
  senderName: string,
) => {
  socket?.emit('sendMessage', {
    roomId,
    message,
    senderId,
    senderName,
    createdAt: new Date(),
  });
};


export const onReceiveMessage = (callback: (msg: ChatMessage) => void) => {
  socket?.on('receiveMessage', callback);
};

export const onLastMessages = (callback: (messages: ChatMessage[]) => void) => {
  socket?.on('lastMessages', callback);
};

export const onUserJoined = (
  callback: (payload: { user: currentUserType; roomId: string }) => void,
) => {
  socket?.on('userJoined', callback);
};


export const onNewNotification = (
  callback: (notification: Notification) => void,
) => {
  socket?.on('newNotification', callback);
};

export const offNotificationEvents = () => {
  socket?.off('newNotification');
};

export const offChatEvents = () => {
  if (!socket) return;
  socket.off('receiveMessage');
  socket.off('lastMessages');
  socket.off('userJoined');
};
