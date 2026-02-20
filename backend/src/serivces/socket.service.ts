import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { Server, Socket } from 'socket.io';
import { IChatService } from './Interfaces/IChat.service';
import { ISocketService } from './Interfaces/ISocket.service';
import { IMessage } from '@/models/Message.model';
import { ErrorMessages } from '@/types/response-messages.types';
import { IBookingRepository } from '@/repositories/interfaces/IBooking.repository';
import { BookingStatus } from '@/models/Booking.model';

interface JoinRoomPayload {
    roomId: string;
    userId: string;
}

interface SendMessagePayload {
    roomId: string;
    senderId: string;
    content: string;
    type?: 'text' | 'image' | 'audio' | 'file';
    senderName?: string;
}

@injectable()
export class SocketService implements ISocketService {
    private _io: Server | null = null;

    constructor(
        @inject(TYPES.ChatService) private _chatService: IChatService,
        @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository
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


            socket.on('joinVideoRoom', async ({ roomId, userId, role }: { roomId: string, userId: string, role: string }) => {
                // Verify access using repository directly to avoid circular dependency
                const booking = await this._bookingRepository.findById(roomId);
                const hasAccess = booking && 
                    (booking.userId.toString() === userId || booking.mentorId.toString() === userId) &&
                    (booking.status === BookingStatus.CONFIRMED);

                if (!hasAccess) {
                    console.log(`Access denied for ${userId} to Room ${roomId}`);
                    socket.emit('error', { message: "Unauthorized access to video room" });
                    return;
                }

                console.log(`Socket ${socket.id} joined Video Room: ${roomId} as ${role}`);
                socket.join(roomId);
                
                socket.to(roomId).emit('user-connected', { userId, role, socketId: socket.id });
                
                if (role === 'mentor') {
                    io.to(roomId).emit('host-online'); 
                }
            });

            socket.on('signal', (data: { to: string, signal: any, from: string }) => {
                io.to(data.to).emit('signal', { signal: data.signal, from: data.from });
            });

             socket.on('check-video-status', (roomId: string, callback: (response: { active: boolean }) => void) => {
                const room = io.sockets.adapter.rooms.get(roomId);
                console.log(room,"room from the socket.service")
                const isActive = room ? room.size > 0 : false;
                console.log(isActive,"is active from the socket.service ===================================")
                callback({ active: isActive });
            });

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
                socket.emit('error', { message: ErrorMessages.AccessDenied });
                return;
            }
           
            socket.join(roomId);

            const history = await this._chatService.getRoomMessages(
                roomId,
                userId
            );

            socket.emit('chatHistory', history);
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: ErrorMessages.JoinChatRoomFailed });
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
                        : ErrorMessages.SendMessageFailed,
            });
        }
    }
}


