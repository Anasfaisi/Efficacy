import { Server, Socket } from 'socket.io';
import { TYPES } from '@/types/inversify-key.types';
import { inject, injectable } from 'inversify';
import { IChatService } from '@/serivces/Interfaces/IChat-message.service';
import { Request, Response } from 'express';

@injectable()
export class ChatController {
    constructor(
        @inject(TYPES.ChatService) private _chatService: IChatService
    ) {}

    async getRoomMessages(req: Request, res: Response) {
        const { roomId } = req.params;
        const messages = await this._chatService.getRoomHistory(roomId);
        return res.json(messages);
    }
}
