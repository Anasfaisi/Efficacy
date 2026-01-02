import { Message, IMessage } from '@/models/Message.model';
import { IMessageRepository } from './interfaces/IMessage.repository';
import { BaseRepository } from './base.repository';
import { injectable } from 'inversify';

@injectable()
export class MessageRepository
    extends BaseRepository<IMessage>
    implements IMessageRepository
{
    constructor() {
        super(Message);
    }

    async findByChat(chatId: string): Promise<IMessage[]> {
        return this.model
            .find({ conversationId: chatId })
            .sort({ createdAt: 1 })
            .populate('senderId', 'name')
            .exec();
    }
}
