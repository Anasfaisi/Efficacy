import { MessageEntity } from '@/entity/message.entity';
import { Message } from '@/models/Message.model';
import { IMessage } from '@/models/Message.model';

export class MessageMapper {
    static toEntity(doc: IMessage): MessageEntity {
        return new MessageEntity(
            doc._id.toString(),
            doc.conversation.toString(),
            doc.senderId.toString(),
            doc.content,
            doc.attachments ?? [],
            doc.status,
            doc.seenBy ? doc.seenBy.toString() : '',
            doc.createdAt ?? new Date(),
            doc.updatedAt ?? new Date()
        );
    }

}
