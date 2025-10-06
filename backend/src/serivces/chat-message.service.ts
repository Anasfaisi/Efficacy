import { IChatMessage } from '@/models/Chat-message.model';
import { IChatMessageRepository } from '@/repositories/interfaces/IChat-message.repository';
import { IChatService } from './Interfaces/IChat-message.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types/inversify-key.types';
@injectable()
export class ChatService implements IChatService {
    constructor(
        @inject(TYPES.ChatMessageRepository)
        private _messageRepo: IChatMessageRepository
    ) {}

    async saveMessage(message: IChatMessage) {
        return this._messageRepo.save(message);
    }

    async getRoomHistory(roomId: string): Promise<IChatMessage[]> {
        return this._messageRepo.getLastMessage(roomId, 100);
    }
}
