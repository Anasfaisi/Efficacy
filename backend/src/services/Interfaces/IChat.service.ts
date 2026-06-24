import { PopulatedMessageEntity } from '@/entity/message.entity';
import { IConversation } from '@/models/conversation.model';
import { IMessage } from '@/models/message.model';
import { MessageType } from '@/types/message-type.types';

export interface IChatService {
    initiateChat(userId: string, mentorId: string): Promise<IConversation>;

    getUserConversations(userId: string): Promise<IConversation[]>;
    getRoomMessages(
        roomId: string,
        userId: string,
        limit?: number,
        skip?: number
    ): Promise<IMessage[]>;

    sendMessage(
        senderId: string,
        roomId: string,
        content: string,
        type: MessageType
    ): Promise<PopulatedMessageEntity>;
    validateRoomAccess(roomId: string, userId: string): Promise<boolean>;
    deleteMessage(userId: string, messageId: string): Promise<IMessage>;
}
