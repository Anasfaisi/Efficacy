import { IChatRepository } from './interfaces/IChat.repository';
import { ConversationModel, IConversation } from '@/models/Conversation.model';
import { MessageModel, IMessage } from '@/models/Message.model';
import { injectable } from 'inversify';

@injectable()
export class ChatRepository implements IChatRepository {
    async createConversation(
        participants: { _id: string; onModel: string }[]
    ): Promise<IConversation> {
        const newConversation = await ConversationModel.create({
            participants,
        });

        // Populate to ensure frontend receives user details immediately
        await newConversation.populate(
            'participants._id',
            'name profilePic role email'
        );

        const convObject = newConversation.toObject();
        return {
            ...convObject,
            participants: (convObject.participants as any[]).map((p) => p._id),
        } as any;
    }

    async findConversationByParticipants(
        participants: { _id: string; onModel: string }[]
    ): Promise<IConversation | null> {
        const participantIds = participants.map((p) => p._id);

        const conversation = await ConversationModel.findOne({
            participants: { $size: participantIds.length },
            'participants._id': { $all: participantIds },
        })
            .populate('participants._id', 'name profilePic role email')
            .lean();

        if (!conversation) return null;

        return {
            ...conversation,
            participants: (conversation.participants as any[]).map(
                (p) => p._id
            ),
        } as any;
    }

    async getUserConversations(userId: string): Promise<IConversation[]> {
        const conversations = await ConversationModel.find({
            'participants._id': userId,
        })
            .populate('participants._id', 'name profilePic role email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .lean();

        // Transform stricture to match frontend expectation (flat array of participants)
        return conversations.map((conv: any) => ({
            ...conv,
            participants: conv.participants.map((p: any) => p._id),
        }));
    }

    async getConversationById(id: string): Promise<IConversation | null> {
        const conversation = await ConversationModel.findById(id)
            .populate('participants._id', 'name profilePic role email')
            .lean();

        if (!conversation) return null;

        // Transform for frontend
        return {
            ...conversation,
            participants: (conversation.participants as any[]).map(
                (p) => p._id
            ),
        } as any;
    }

    async createMessage(data: Partial<IMessage>): Promise<IMessage> {
        let message = await MessageModel.create(data);
        message = await message.populate('senderId', 'name');
        
        const msgObject = message.toObject();
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
        const messages = await MessageModel.find({ conversationId })
            .populate('senderId', 'name')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .lean();
        
        return messages.map((msg: any) => ({
            ...msg,
            senderName: msg.senderId?.name,
            senderId: msg.senderId?._id,
        }));
    }

    async markMessagesAsRead(
        conversationId: string,
        userId: string
    ): Promise<void> {
        await MessageModel.updateMany(
            { conversationId, senderId: { $ne: userId }, isRead: false },
            { $set: { isRead: true } }
        );
    }

    async updateLastMessage(
        conversationId: string,
        messageId: string
    ): Promise<void> {
        await ConversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: messageId,
        });
    }

    async deleteMessage(messageId: string): Promise<IMessage | null> {
        return MessageModel.findByIdAndDelete(messageId);
    }

    async getMessageById(messageId: string): Promise<IMessage | null> {
        return MessageModel.findById(messageId);
    }
}
