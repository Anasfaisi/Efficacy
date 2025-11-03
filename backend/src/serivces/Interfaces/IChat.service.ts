import { CreateChatDTO, CreateMessageDTO } from '@/Dto/requestDto';
import { ChatResponseDTO, MessageResponseDto } from '@/Dto/responseDto';
import { IChat } from '@/models/Conversation.model';
import { IMessage } from '@/models/Message.model';

export interface IChatService {
    findchatById(chatId: string): Promise<IChat | null>;
    createChat(dto: CreateChatDTO): Promise<ChatResponseDTO>;
    // createMessage(message: CreateMessageDTO): Promise<MessageResponseDto>;
}
