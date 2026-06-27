import { MessageModel, IMessage } from '@/models/message.model';
import { IMessageRepository } from './interfaces/IMessage.repository';
import { BaseRepository } from './base.repository';
import { injectable } from 'inversify';

@injectable()
export class MessageRepository
    extends BaseRepository<IMessage>
    implements IMessageRepository
{
    constructor() {
        super(MessageModel);
    }

    async findByChat(
        chatId: string,
        limit?: number,
        skip?: number
    ): Promise<IMessage[]> {
        let query = this.model
            .find({ conversationId: chatId })
            .sort({ createdAt: 1 });

        if (skip !== undefined) query = query.skip(skip);
        if (limit !== undefined) query = query.limit(limit);

        return query.exec();
    }
}
