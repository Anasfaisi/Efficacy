import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { Server, Socket } from 'socket.io';
import { IChatService } from './Interfaces/IChat.service';
import { ISocketService } from './Interfaces/ISocket.service';
import { IMessage } from '@/models/Message.model';

interface JoinRoomPayload {
    roomId: string;
    userId: string;
}

interface SendMessagePayload {
    roomId: string;
    senderId: string;
    content: string;
    type?: 'text' | 'image' | 'file';
    senderName?: string; // Optional, useful for UI optimization
}

@injectable()
export class SocketService implements ISocketService {
    private _io: Server | null = null;

    constructor(
        @inject(TYPES.ChatService) private _chatService: IChatService
    ) {}

    public register(io: Server) {
        this._io = io;
        io.on('connection', (socket: Socket) => {
            console.log('Socket Connected:', socket.id);

            socket.on('joinUserRoom', (userId: string) => {
                socket.join(userId);
                console.log(
                    `Socket ${socket.id} joined notification room: ${userId}`
                );
            });

            socket.on('joinRoom', (payload: JoinRoomPayload) =>
                this.handleJoinRoom(socket, payload)
            );
            socket.on('sendMessage', (payload: SendMessagePayload) =>
                this.handleSendMessage(io, socket, payload)
            );

            socket.on('disconnect', () => {
                console.log('Socket Disconnected:', socket.id);
            });
        });
    }

    public emitToRoom(roomId: string, event: string, data: unknown) {
        if (this._io) {
            this._io.to(roomId).emit(event, data);
        }
    }

    public async emitNotification(userId: string, notification: unknown) {
        if (this._io) {
            this._io.to(userId).emit('newNotification', notification);
        }
    }

    private async handleJoinRoom(
        socket: Socket,
        { roomId, userId }: JoinRoomPayload
    ) {
        try {
            const canJoin = await this._chatService.validateRoomAccess(
                roomId,
                userId
            );
            if (!canJoin) {
                socket.emit('error', { message: 'Access denied to this room' });
                return;
            }
            console.log(
                'join room=================',
                roomId,
                userId,
                canJoin,
                'from socket service'
            );
            socket.join(roomId);

            const history = await this._chatService.getRoomMessages(
                roomId,
                userId
            );

            socket.emit('chatHistory', history);
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: 'Failed to join chat room' });
        }
    }

    private async handleSendMessage(
        io: Server,
        socket: Socket,
        payload: SendMessagePayload
    ) {
        try {
            const { roomId, senderId, content, type = 'text' } = payload;

            const savedMessage = await this._chatService.sendMessage(
                senderId,
                roomId,
                content,
                type
            );

            io.to(roomId).emit('receiveMessage', savedMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', {
                message:
                    error instanceof Error
                        ? error.message
                        : 'Failed to send message',
            });
        }
    }
}
