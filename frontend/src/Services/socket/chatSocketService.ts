import { io, Socket } from 'socket.io-client';
import type { User } from '@/types/auth';
import type { ChatMessage } from '@/types/chat.types';

let socket: Socket | null = null;

export const connectChatSocket = () => {
  console.log('we are setting the connectchat socket');
  try {
    if (!socket) {
      socket = io('http://localhost:5000' /*import.meta.env.VITE_API_URL*/, {
        transports: ['websocket'],
        withCredentials: true,
      });
      socket.on('connect', () => {
        console.log('connected to the chat socket', socket?.id);
      });
      console.log('socket', socket, 'socket');

      socket.on('disconnect', (reason) => {
        console.log('disconnected from the chat socket:', reason);
        socket = null;
      });
    }
    return socket;
  } catch (error) {
    console.log('the error from the connecting socket from frontend', error);
  }
};

export const disconnectChatSocket = () => {
  if (socket) {
    console.log('socket in disconnect', socket);
    socket.disconnect();
    socket = null;
  }
};

export const joinRoom = (roomId: string, user: User) => {
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
  callback: (payload: { user: User; roomId: string }) => void,
) => {
  socket?.on('userJoined', callback);
};

export const offChatEvents = () => {
  if (!socket) return;
  socket.off('receiveMessage');
  socket.off('lastMessages');
  socket.off('userJoined');
};
