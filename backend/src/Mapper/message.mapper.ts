import { MessageEntity } from '@/entity/message.entity';
import { IMessage } from '@/models/Message.model';
import { Types } from 'mongoose';
import { MessageStatus } from '@/types/role.types';

export class MessageMapper {
    static toEntity(doc: IMessage): MessageEntity {

        return new MessageEntity(
            (doc._id as Types.ObjectId).toString(),
            doc.conversationId.toString(),
            doc.senderId.toString(),
            doc.content,
            [], 
            doc.isRead ? MessageStatus.READ : MessageStatus.SENT,                                       
            '',
            doc.createdAt ?? new Date(),
            doc.updatedAt ?? new Date()
        );
    }
}
