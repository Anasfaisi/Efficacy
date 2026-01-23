import { IConversation } from '@/models/Conversation.model';
import { IMessage } from '@/models/Message.model';

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
        type?: 'text' | 'image' | 'file'
    ): Promise<IMessage>;
    validateRoomAccess(roomId: string, userId: string): Promise<boolean>;
}
