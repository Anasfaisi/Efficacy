import { IChat } from '@/models/chat.model';

export interface IChatRepository {
    findById(chatId: string): Promise<IChat | null>;
    findByParticipants(userA: string, userB: string): Promise<IChat | null>;
    createChat(userA: string, userB: string): Promise<IChat>;
    updateLastMessage(chatId: string, messageId: string): Promise<void>;
}
