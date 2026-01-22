import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { Server, Socket } from 'socket.io';
import { IChatService } from './Interfaces/IChat.service';
import { IChatMessage } from '@/models/Chat-message.model';
import { SendMessagePayload } from '@/types/response-messages.types';
import { JoinRoomDto } from '@/Dto/request.dto';
import { ISocketService } from './Interfaces/ISocket.service';
import { IUser } from '@/models/User.model';
import { IMessage } from '@/models/Message.model';
import { Types } from 'mongoose';

@injectable()
export class SocketService implements ISocketService {
    private _io: Server | null = null;

    constructor(
        @inject(TYPES.ChatService) private _chatService: IChatService
    ) {}

    public register(io: Server) {
        this._io = io;
        io.on('connection', (socket: Socket) => {
            console.log('User connected: in the backend', socket.id);

            socket.on('joinRoom', (data: { roomId: string; user: unknown }) => {
                const dto = new JoinRoomDto(data.roomId, data.user as IUser);
                this.handleJoinRoom(socket, dto);
            });

            // socket.on('joinRoleRoom', (role: string) => {
            //     socket.join(role);
            //     console.log(`Socket ${socket.id} joined role room: ${role}`);
            // });

            socket.on('joinUserRoom', (userId: string) => {
                socket.join(userId);
                console.log(`Socket ${socket.id} joined private user room there: ${userId}`);
            });

            socket.on('sendMessage', (payload: SendMessagePayload) =>
                this.handleSendMessage(io, socket, payload)
            );

            socket.on('disconnect', () => this.handleDisconnect(socket));
        });
    }

    public emitToRoom(roomId: string, event: string, data: unknown) {
        if (this._io) {
            this._io.to(roomId).emit(event, data);
        }
    }

    public async emitNotification(roomId: string, notification: unknown) {
        if (this._io) {
            const sockets = await this._io.in(roomId).fetchSockets();
            for (const socket of sockets) {
                socket.emit('newNotification', notification);
            }
        }
    }

    private async handleJoinRoom(socket: Socket, payload: JoinRoomDto) {
        const { roomId, user } = payload;
        socket.join(roomId);

        const history = await this._chatService.getRoomHistory(roomId);
        socket.emit('lastMesages', history);
        socket.to(roomId).emit('userJoined', { user });
    }

    private async handleSendMessage(
        io: Server,
        socket: Socket,
        payload: SendMessagePayload
    ) {
        const { roomId, senderId, senderName, message } = payload;

        const saved = await this._chatService.saveMessage({
            conversationId: roomId as unknown as Types.ObjectId,
            senderId: senderId as unknown as Types.ObjectId,
            content: message,
            createdAt: new Date(),
        } as Partial<IMessage>);

        io.to(roomId).emit('receiveMessage', saved);
    }

    private handleDisconnect(socket: Socket) {
        console.log('user disconnected', socket.id);
    }
}
