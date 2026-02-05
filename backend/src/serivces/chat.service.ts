import { injectable, inject } from 'inversify';
import { IChatService } from './Interfaces/IChat.service';
import { IChatRepository } from '@/repositories/interfaces/IChat.repository';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { TYPES } from '@/config/inversify-key.types';
import { IConversation } from '@/models/Conversation.model';
import { IMessage } from '@/models/Message.model';
import { IMentorshipRepository } from '@/repositories/interfaces/IMentorship.repository';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class ChatService implements IChatService {
    constructor(
        @inject(TYPES.ChatRepository) private _chatRepository: IChatRepository,
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.MentorshipRepository)
        private _mentorshipRepository: IMentorshipRepository
    ) {}

    private async validateActiveMentorship(
        userId: string,
        mentorId: string
    ): Promise<void> {
        const activeMentorship =
            await this._mentorshipRepository.findByUserIdAndMentorId(
                mentorId,
                userId
            );
        if (!activeMentorship) {
            throw new Error(
                ErrorMessages.ActiveMentorshipRequired
            );
        }

        const allowedStatuses = ['active', 'completed'];
        if (!allowedStatuses.includes(activeMentorship.status)) {
            throw new Error(ErrorMessages.MentorshipNotActiveOrCompleted);
        }
    }

    async initiateChat(
        userId: string,
        mentorId: string
    ): Promise<IConversation> {
        await this.validateActiveMentorship(userId, mentorId);

        const participantsPayload = [
            { _id: userId, onModel: 'Users' },
            { _id: mentorId, onModel: 'Mentors' },
        ];

        const existing =
            await this._chatRepository.findConversationByParticipants(
                participantsPayload
            );
        if (existing) return existing;

        return this._chatRepository.createConversation(participantsPayload);
    }

    async getUserConversations(userId: string): Promise<IConversation[]> {
        return this._chatRepository.getUserConversations(userId);
    }

    async getRoomMessages(
        roomId: string,
        userId: string,
        limit: number = 50,
        skip: number = 0
    ): Promise<IMessage[]> {
        const conversation =
            await this._chatRepository.getConversationById(roomId);
        if (!conversation) throw new Error(ErrorMessages.ChatRoomNotFound);

        const isParticipant = conversation.participants.some(
            (p) => p._id.toString() === userId || p.toString() === userId
        );
        if (!isParticipant) throw new Error(ErrorMessages.AccessDenied);

        return this._chatRepository.getMessages(roomId, limit, skip);
    }

    async sendMessage(
        senderId: string,
        roomId: string,
        content: string,
        type: 'text' | 'image' | 'audio' | 'file' = 'text'
    ): Promise<IMessage> {
        const message = await this._chatRepository.createMessage({
            conversationId: roomId as any,
            senderId: senderId as any,
            content,
            type,
            isRead: false,
        } as Partial<IMessage>);

        await this._chatRepository.updateLastMessage(
            roomId,
            message._id as string
        );

        return message;
    }

    async validateRoomAccess(roomId: string, userId: string): Promise<boolean> {
        const conversation =
            await this._chatRepository.getConversationById(roomId);
        if (!conversation) return false;
        const isParticipant = conversation.participants.some(
            (p) => p._id.toString() === userId || p.toString() === userId
        );
        return isParticipant;
    }

    async deleteMessage(userId: string, messageId: string): Promise<IMessage> {
        const message = await this._chatRepository.getMessageById(messageId);
        if (!message) throw new Error(ErrorMessages.MessageNotFound);

        if (message.senderId.toString() !== userId) {
            throw new Error(ErrorMessages.DeleteOwnMessagesOnly);
        }

        const deleted = await this._chatRepository.deleteMessage(messageId);
        if (!deleted) throw new Error(ErrorMessages.DeleteMessageFailed);
        return deleted;
    }
}
