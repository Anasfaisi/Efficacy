import { IMessage } from '@/models/Message.model';

export interface IMessageRepository {
   create(message:IMessage):Promise<IMessage>
   findByChat(chatId:string):Promise<IMessage[]>
}
