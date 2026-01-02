import { IMessage } from '@/models/Message.model';
import { IBaseRepository } from './IBase.repository';

export interface IMessageRepository extends IBaseRepository<IMessage> {
    findByChat(chatId: string): Promise<IMessage[]>;
}
