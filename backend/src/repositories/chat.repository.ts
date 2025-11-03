import { ChatModel, IChat } from '@/models/Conversation.model';
import { IChatRepository } from './interfaces/IChat.repository';

export class ChatRepository implements IChatRepository {
    async findById(chatId: string): Promise<IChat | null> {
        return ChatModel.findById(chatId).populate('lastMessage');
    }

    async findByParticipants(
        userA: string,
        userB: string
    ): Promise<IChat | null> {
        return ChatModel.findOne({
            participants: { $all: [userA, userB], $size: 2 },
            isGroup: false,
        });
    }

    async createChat(userA: string, userB: string): Promise<IChat> {
        const newChat = new ChatModel({
            participants: [userA, userB],
            isGroup: false,
        });
        return newChat.save();
    }

    async updateLastMessage(chatId: string, messageId: string): Promise<void> {
        await ChatModel.findByIdAndUpdate(chatId, {
            lastMessage: messageId,
        });
    }
}
