import { CreateChatDTO } from '@/Dto/request.dto';
import { ChatResponseDTO } from '@/Dto/response.dto';
import { IChat } from '@/models/Conversation.model';
import { IMessage } from '@/models/Message.model';

export interface IChatService {
    findchatById(chatId: string): Promise<IChat | null>;
    createChat(dto: CreateChatDTO): Promise<ChatResponseDTO>;
    getRoomHistory(roomId: string): Promise<IMessage[]>;
    saveMessage(message: Partial<IMessage>): Promise<IMessage>;
}
