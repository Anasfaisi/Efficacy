import { ISocketService } from '@/serivces/Interfaces/ISocket.service';
import { TYPES } from '@/config/inversify-key.types';
import { Server } from 'socket.io';
import { inject, injectable } from 'inversify';

@injectable()
export class SocketController {
    constructor(
        @inject(TYPES.SocketService) private _socketService: ISocketService
    ) {}
    async initializeSockets(io: Server) {
        this._socketService.register(io);
    }
}
