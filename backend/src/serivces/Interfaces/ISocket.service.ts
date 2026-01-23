import { Server } from 'socket.io';

export interface ISocketService {
    register(io: Server): void;
    emitToRoom(roomId: string, event: string, data: unknown): void;
    emitNotification(
        roomId: string,
        notification: unknown
    ): void | Promise<void>;
}
