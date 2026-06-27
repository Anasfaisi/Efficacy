import { BaseRepository } from './base.repository';
import { IChatRepository } from './interfaces/IChat.repository';
import { ConversationModel, IConversation } from '@/models/conversation.model';
import { IMessage } from '@/models/message.model';
import { injectable, inject } from 'inversify';
import { IMessageRepository } from './interfaces/IMessage.repository';
import { TYPES } from '@/config/inversify-key.types';
import { Types } from 'mongoose';
import { MessageEntity, PopulatedMessageEntity } from '@/entity/message.entity';
import { MessageMapper } from '@/Mapper/message.mapper';

interface PopulatedParticipant {
    _id: {
        _id: Types.ObjectId;
        name: string;
        email: string;
        role: string;
        profilePic?: string;
    };
    onModel: string;
}

@injectable()
export class ChatRepository
    extends BaseRepository<IConversation>
    implements IChatRepository
{
    constructor(
        @inject(TYPES.MessageRepository)
        private _messageRepository: IMessageRepository
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
            participants: (
                convObject.participants as unknown as PopulatedParticipant[]
            ).map((p) => p._id),
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
            .lean<
                | (Omit<IConversation, 'participants'> & {
                      participants: PopulatedParticipant[];
                  })
                | null
            >();

        if (!conversation) return null;

        return {
            ...conversation,
            participants: conversation.participants.map((p) => p._id),
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
            .lean<
                (Omit<IConversation, 'participants'> & {
                    participants: PopulatedParticipant[];
                })[]
            >();

        return conversations.map((conv) => ({
            ...conv,
            participants: conv.participants.map((p) => p._id),
        })) as unknown as IConversation[];
    }

    async getConversationById(id: string): Promise<IConversation | null> {
        const conversation = await this.model
            .findById(id)
            .populate('participants._id', 'name profilePic role email')
            .lean();

        if (!conversation) return null;

        return {
            ...conversation,
            participants: conversation.participants.map((p) => p._id),
        } as unknown as IConversation;
    }

    async createMessage(
        data: Partial<MessageEntity>
    ): Promise<PopulatedMessageEntity> {
        const persistence = MessageMapper.toPersistence(data);
        const message = await this._messageRepository.create(persistence);

        const conversation = await this.model
            .findById(data.conversationId)
            .populate('participants._id', 'name')
            .lean<
                | (Omit<IConversation, 'participants'> & {
                      participants: PopulatedParticipant[];
                  })
                | null
            >();

        let senderName = '';
        if (conversation) {
            const participant = conversation.participants.find(
                (p) => p._id._id.toString() === data.senderId
            );
            if (participant) senderName = participant._id.name;
        }

        const populatedEntity = MessageMapper.toPopulatedEntity(message);
        populatedEntity.senderName = senderName;
        return populatedEntity;
    }

    async getMessages(
        conversationId: string,
        limit: number = 50,
        skip: number = 0
    ): Promise<IMessage[]> {
        const messages =
            await this._messageRepository.findByChat(conversationId);

        const conversation = await this.model
            .findById(conversationId)
            .populate('participants._id', 'name')
            .lean<
                | (Omit<IConversation, 'participants'> & {
                      participants: PopulatedParticipant[];
                  })
                | null
            >();

        const participantsMap = new Map<string, string>();
        if (conversation) {
            conversation.participants.forEach((p) => {
                participantsMap.set(p._id._id.toString(), p._id.name);
            });
        }

        const paginatedMessages = messages.slice(skip, skip + limit);

        return paginatedMessages.map((msg) => {
            const msgObj = msg.toObject ? msg.toObject() : msg;
            const senderIdStr = msgObj.senderId.toString();

            return {
                ...msgObj,
                senderName: participantsMap.get(senderIdStr),
                senderId: senderIdStr,
            } as unknown as IMessage;
        });
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
        await this.update(conversationId, {
            lastMessage: new Types.ObjectId(messageId),
        });
    }

    async deleteMessage(messageId: string): Promise<IMessage | null> {
        await this._messageRepository.deleteOne(messageId);
        return null;
    }

    async getMessageById(messageId: string): Promise<IMessage | null> {
        return this._messageRepository.findById(messageId);
    }
}
