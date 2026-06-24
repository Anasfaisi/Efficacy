import { MessageEntity, PopulatedMessageEntity } from '@/entity/message.entity';
import { IMessage } from '@/models/message.model';
import { Types } from 'mongoose';

export class MessageMapper {
    static toEntity(doc: IMessage): MessageEntity {
        return new MessageEntity(
            (doc._id as Types.ObjectId).toString(),
            doc.conversationId.toString(),
            doc.senderId.toString(),
            doc.content,
            doc.isRead,
            doc.type,
            doc.createdAt ?? new Date(),
            doc.updatedAt ?? new Date()
        );
    }

    static toPersistence(
        messageData: Partial<MessageEntity>
    ): Partial<IMessage> {
        return {
            _id: new Types.ObjectId(messageData.id),
            conversationId: new Types.ObjectId(messageData.conversationId),
            senderId: new Types.ObjectId(messageData.senderId),
            content: messageData.content,
            isRead: messageData.isRead,
            type: messageData.type,
        };
    }

    static toPopulatedEntity(messageData: IMessage): PopulatedMessageEntity {
        // Cast the populated senderId to its expected structure
        const sender = messageData.senderId as unknown as {
            _id: Types.ObjectId;
            name: string;
        };

        return {
            id: messageData.id,
            conversationId: messageData.conversationId.toString(),
            senderId: sender._id
                ? sender._id.toString()
                : messageData.senderId.toString(),
            content: messageData.content,
            isRead: messageData.isRead,
            type: messageData.type,
            createdAt: messageData.createdAt ?? new Date(),
            updatedAt: messageData.updatedAt ?? new Date(),
            senderName: sender.name,
        };
    }
}
