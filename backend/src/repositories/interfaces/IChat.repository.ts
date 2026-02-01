import { IConversation } from '@/models/Conversation.model';
import { IMessage } from '@/models/Message.model';

export interface IChatRepository {
    createConversation(
        participants: { _id: string; onModel: string }[]
    ): Promise<IConversation>;
    findConversationByParticipants(
        participants: { _id: string; onModel: string }[]
    ): Promise<IConversation | null>;
    getUserConversations(userId: string): Promise<IConversation[]>;
    getConversationById(id: string): Promise<IConversation | null>;

    createMessage(data: Partial<IMessage>): Promise<IMessage>;
    getMessages(
        conversationId: string,
        limit: number,
        skip: number
    ): Promise<IMessage[]>;
    markMessagesAsRead(conversationId: string, userId: string): Promise<void>;
    updateLastMessage(conversationId: string, messageId: string): Promise<void>;
}
