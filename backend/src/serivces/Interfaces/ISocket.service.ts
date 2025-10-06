import { Server } from 'socket.io';

export interface ISocketService {
    register(io: Server): void;
}
