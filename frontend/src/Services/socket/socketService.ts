import { io, Socket } from 'socket.io-client';
import type { currentUserType } from '@/types/auth';

import type { Message } from '@/types/chat.types';
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

export const connectSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log(
                'socketService: Connected successfully! ID:',
                socket?.id
            );
        });

        socket.on('disconnect', (reason) => {
            console.warn('socketService: Disconnected. Reason:', reason);
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket?.connect();
            }
        });

        socket.on('connect_error', (error) => {
            console.error('socketService: Connection error:', error.message);
        });
    } else {
        console.log(
            'socketService: Existing socket found. State:',
            socket.connected ? 'Connected' : 'Disconnected'
        );
        if (!socket.connected) {
            console.log(
                'socketService: Attempting to reconnect existing socket...'
            );
            socket.connect();
        }
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

// export const joinRoleRoom = (role: string) => {
//     socket?.emit('joinRoleRoom', role);
// };

export const joinUserRoom = (userId: string) => {
    console.log('socketService: Joining private user room:', userId);
    socket?.emit('joinUserRoom', userId);
};

export const joinRoom = (roomId: string, user: currentUserType) => {
    let count = 1;
    console.log(count++);
    socket?.emit('joinRoom', { roomId, user });
};

export const leaveRoom = (roomId: string, userId: string) => {
    socket?.emit('leaveRoom', { roomId, userId });
};

export const sendMessage = (
    roomId: string,
    message: string,
    senderId: string,
    senderName: string
) => {
    socket?.emit('sendMessage', {
        roomId,
        message,
        senderId,
        senderName,
        createdAt: new Date(),
    });
};

export const onReceiveMessage = (callback: (msg: Message) => void) => {
    socket?.on('receiveMessage', callback);
};

export const onLastMessages = (callback: (messages: Message[]) => void) => {
    socket?.on('lastMessages', callback);
};

export const onUserJoined = (
    callback: (payload: { user: currentUserType; roomId: string }) => void
) => {
    socket?.on('userJoined', callback);
};

export const onNewNotification = (
    callback: (notification: Notification) => void
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

// --- Video Call Methods ---
export const joinVideoRoom = (roomId: string, userId: string, role: 'mentor' | 'user') => {
    socket?.emit('joinVideoRoom', { roomId, userId, role });
};

export const signalPeer = (data: { to: string, signal: any, from: string }) => {
    socket?.emit('signal', data);
};

export const onUserConnected = (callback: (data: { userId: string, role: string, socketId: string }) => void) => {
    socket?.on('user-connected', callback);
};

export const onSignal = (callback: (data: { signal: any, from: string }) => void) => {
    socket?.on('signal', callback);
};

export const onHostOnline = (callback: () => void) => {
    socket?.on('host-online', callback);
};

export const checkVideoStatus = (roomId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!socket || !socket.connected) {
            console.warn("Socket not connected, returning false for video status");
            resolve(false);
            return;
        }
        
        socket?.emit('check-video-status', roomId, (response: { active: boolean }) => {
            console.log("Video status check response:", response);
            resolve(response.active);
        });
        
     
    });
};

export const offVideoEvents = () => {
    if(!socket) return;
    socket.off('user-connected');
    socket.off('signal');
    socket.off('host-online');
};
// -------------------------
