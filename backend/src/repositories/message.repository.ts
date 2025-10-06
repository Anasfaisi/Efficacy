// // message.repository.ts
// import { injectable } from 'inversify';
// import { IMessage, Message } from '@/models/Message.model';
// import { Types } from 'mongoose';
// import { SendMessageRequestDto } from '@/Dto/requestDto';

// @injectable()
// export class MessageRepository {
//     async createMessage(data: SendMessageRequestDto): Promise<IMessage> {
//         const message = new Message({
//             conversation: new Types.ObjectId(data.conversationId),
//             senderId: new Types.ObjectId(data.senderId),
//             content: data.content,
//             attachments: data.attachments || [],
//             status: data.status || 'SENT',
//         });

//         return await message.save();
//     }

//     async getMessagesByConversation(
//         conversationId: string
//     ): Promise<IMessage[]> {
//         return Message.find({ conversation: conversationId }).sort({
//             createdAt: 1,
//         });
//     }

//     async markAsSeen(
//         messageId: string,
//         userId: string
//     ): Promise<IMessage | null> {
//         return Message.findByIdAndUpdate(
//             messageId,
//             { $addToSet: { seenBy: new Types.ObjectId(userId) } },
//             { new: true }
//         );
//     }
// }

import { Message, IMessage } from '@/models/Message.model';
import { IMessageRepository } from './interfaces/IMessage.repository';


export class MessageRepository implements IMessageRepository {
    async create(message: Omit<IMessage, '_id' | 'status'>): Promise<IMessage> {
        const newMessage = new Message(message);
        return newMessage.save();
    }

    async findByChat(chatId: string): Promise<IMessage[]> {
        return Message.find({ conversation: chatId })
            .sort({ createdAt: 1 })
            .populate('senderId', 'name');
    }
}
