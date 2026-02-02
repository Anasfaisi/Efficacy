import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IChatService } from '@/serivces/Interfaces/IChat.service';
import { ISocketService } from '@/serivces/Interfaces/ISocket.service';
import Code from '@/types/http-status.enum';

@injectable()
export class ChatController {
    constructor(
        @inject(TYPES.ChatService) private _chatService: IChatService,
        @inject(TYPES.SocketService) private _socketService: ISocketService
    ) {}

    async initiateChat(req: Request, res: Response) {
        const { mentorId } = req.body;
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(Code.UNAUTHORIZED).json({
                message: 'User not found',
            });
            return;
        }

        const conversation = await this._chatService.initiateChat(
            userId,
            mentorId
        );
        res.status(Code.OK).json(conversation);
    }

    async getUserConversations(req: Request, res: Response) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(Code.UNAUTHORIZED).json({
                message: 'User not found',
            });
            return;
        }
        const conversations =
            await this._chatService.getUserConversations(userId);
        res.status(Code.OK).json(conversations);
    }

    async getRoomMessages(req: Request, res: Response) {
        const { roomId } = req.params;
        const userId = (req.currentUser as any)._id;
        const messages = await this._chatService.getRoomMessages(
            roomId,
            userId
        );

        res.status(Code.OK).json(messages);
    }

    async uploadFile(req: Request, res: Response) {
        if (!req.file) {
            res.status(Code.BAD_REQUEST).json({ message: 'No file uploaded' });
            return;
        }

        const fileUrl = `${req.protocol}://${req.get(
            'host'
        )}/uploads/${req.file.filename}`;

        res.status(Code.OK).json({ url: fileUrl });
    }

    async deleteMessage(req: Request, res: Response) {
        const { messageId } = req.params;
        const userId = req.currentUser?.id;

        if (!userId) {
            res.status(Code.UNAUTHORIZED).json({ message: 'Unauthorized' });
            return;
        }

        const deletedMessage = await this._chatService.deleteMessage(
            userId,
            messageId
        );

        this._socketService.emitToRoom(
            deletedMessage.conversationId.toString(),
            'messageDeleted',
            { messageId: deletedMessage._id }
        );

        res.status(Code.OK).json({ message: 'Message deleted' });
    }
}
