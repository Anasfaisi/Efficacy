import { ChatMessage, IChatMessage } from '@/models/Chat-message.model';
import { IChatMessageRepository } from './interfaces/IChat-message.repository';

export class ChatMessageRepository implements IChatMessageRepository {
    async save(message: IChatMessage): Promise<IChatMessage> {
        return await new ChatMessage(message).save();
    }

    async getLastMessage(
        roomId: string,
        limit?: number
    ): Promise<IChatMessage[]> {
        return await ChatMessage.find({ roomId })
            .sort({ createdAt: -1 })
            .limit(limit!);
    }
}
