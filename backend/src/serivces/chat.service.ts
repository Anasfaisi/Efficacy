import { injectable, inject } from 'inversify';
import { IChatService } from './Interfaces/IChat.service';
import {
    CreateChatDTO,
    CreateMessageDTO,
} from '@/Dto/requestDto';
import { ChatResponseDTO, MessageResponseDto } from '@/Dto/responseDto';
import { IMessageRepository } from '@/repositories/interfaces/IMessage.repository';
import { TYPES } from '@/types/inversify-key.types';
import { Types } from 'mongoose';
import { MessageStatus } from '@/types/role.types';
import { IChatRepository } from '@/repositories/interfaces/IChat.repository';
import { IChat } from '@/models/Conversation.model';
import { IMessage } from '@/models/Message.model';

@injectable()
export class ChatService implements IChatService {
    constructor(
        @inject(TYPES.ChatRepository) private _chatRepository: IChatRepository,
        @inject(TYPES.MessageRepository) private _messageRepository: IMessageRepository,
      
    ) {}
    async findchatById(chatId: string): Promise<IChat | null> {
        return this._chatRepository.findById(chatId);
    }

    async createChat(data: CreateChatDTO): Promise<ChatResponseDTO> {
        const existingChat = await this._chatRepository.findByParticipants(
            data.userA,
            data.userB
        );
        const chat =
            existingChat ??
            (await this._chatRepository.createChat(data.userA, data.userB));

        return {
            id: chat._id.toString(),
            participants: chat.participants.map((p) => p.toString()),
            lastMessage: chat.lastMessage?.toString(),
            isGroup: !!chat.isGroup,
            createdAt: chat.createdAt,
        };
    }

    // async createMessage(dto: CreateMessageDTO): Promise<MessageResponseDto> {
        // const messageData: Omit<IMessage, '_id' | 'status'> = {
    //   conversationId: new Types.ObjectId(dto.conversationId),
    //   senderId: new Types.ObjectId(dto.senderId),
    //   content: dto.content,
    //   attachments: dto.attachments,
    //   seenBy: [], 
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    //  const saved = await this._messageRepository.create(messageData);
    //     await this._chatRepository.updateLastMessage(
    //         dto.conversationId,
    //         saved.
    //     );

    //     return new MessageResponseDto(
            
    //         saved.conversationId.toString(),
    //         saved.senderId.toString(),
    //         saved.content,
    //         saved.attachments,
    //         saved.status,
    //         saved.seenBy?.map((id) => id.toString()),
    //         saved.createdAt,
    //         saved.updatedAt
    //     );
    // }
}
