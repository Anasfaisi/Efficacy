import { BaseRepository } from './base.repository';
import { IChatRepository } from './interfaces/IChat.repository';
import { ConversationModel, IConversation } from '@/models/conversation.model';
import { IMessage } from '@/models/message.model';
import { injectable, inject } from 'inversify';
import { IMessageRepository } from './interfaces/IMessage.repository';
import { TYPES } from '@/config/inversify-key.types';
import { Types } from 'mongoose';

@injectable()
export class ChatRepository
    extends BaseRepository<IConversation>
    implements IChatRepository
{

    constructor(
        @inject(TYPES.MessageRepository)private  _messageRepository: IMessageRepository
    ) {
        super(ConversationModel);
    }

    async createConversation(
        participants: { _id: string; onModel: string }[]
    ): Promise<IConversation> {
        const newConversation = await this.model.create({
            participants,
        });

        await newConversation.populate(
            'participants._id',
            'name profilePic role email'
        );

        const convObject = newConversation.toObject();
        return {
            ...convObject,
            participants: (convObject.participants).map((p) => p._id),
        } as unknown as IConversation;
    }

    async findConversationByParticipants(
        participants: { _id: string; onModel: string }[]
    ): Promise<IConversation | null> {
        const participantIds = participants.map((p) => p._id);

        const conversation = await this.model
            .findOne({
                participants: { $size: participantIds.length },
                'participants._id': { $all: participantIds },
            })
            .populate('participants._id', 'name profilePic role email')
            .lean();

        if (!conversation) return null;

        return {
            ...conversation,
            participants: (conversation.participants ).map(
                (p:{_id:Types.ObjectId}) => p._id
            ),
        } as unknown as IConversation;
    }

    async getUserConversations(userId: string): Promise<IConversation[]> {
        const conversations = await this.model
            .find({
                'participants._id': userId,
            })
            .populate('participants._id', 'name profilePic role email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .lean();

        return conversations.map((conv: any) => ({
            ...conv,
            participants: conv.participants.map((p: any) => p._id),
        }));
    }

    async getConversationById(id: string): Promise<IConversation | null> {
        const conversation = await this.model
            .findById(id)
            .populate('participants._id', 'name profilePic role email')
            .lean();

        if (!conversation) return null;

        return {
            ...conversation,
            participants: (conversation.participants).map(
                (p) => p._id
            ),
        } as IConversation;
    }

    async createMessage(data: Partial<IMessage>): Promise<IMessage> {
        let message = await this._messageRepository.create(data);

        message = await (message as any).populate('senderId', 'name');

        const msgObject = (message as any).toObject
            ? (message as any).toObject()
            : message;
        return {
            ...msgObject,
            senderName: (msgObject.senderId as any)?.name,
            senderId: (msgObject.senderId as any)?._id,
        } as any;
    }

    async getMessages(
        conversationId: string,
        limit: number = 50,
        skip: number = 0
    ): Promise<IMessage[]> {
        const messages = await (this._messageRepository as any).findByChat(
            conversationId
        );

        const paginatedMessages = messages.slice(skip, skip + limit);

        return paginatedMessages.map((msg: any) => ({
            ...(msg.toObject ? msg.toObject() : msg),
            senderName: msg.senderId?.name,
            senderId: msg.senderId?._id,
        }));
    }

    async markMessagesAsRead(
        conversationId: string,
        userId: string
    ): Promise<void> {
        (await this._messageRepository.updateMany(
            { conversationId, senderId: { $ne: userId }, isRead: false },
            { isRead: true }
        )) as void;
    }

    async updateLastMessage(
        conversationId: string,
        messageId: string
    ): Promise<void> {
        await this.updateOne(conversationId, {
            lastMessage: messageId as any,
        });
    }

    async deleteMessage(messageId: string): Promise<IMessage | null> {
        await this._messageRepository.deleteOne(messageId);
        return null; // Return type compatibility, technically findByIdAndDelete returns the doc.
    }

    async getMessageById(messageId: string): Promise<IMessage | null> {
        return this._messageRepository.findById(messageId);
    }
}
