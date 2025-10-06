import { MessageStatus } from '@/types/role.types';

export class MessageEntity {
    constructor(
        public id: string,
        public conversationId: string,
        public senderId: string,
        public content: string,
        public attachments: string[],
        public status: MessageStatus,
        public seenBy: string,
        public createdAt: Date,
        public updatedAt: Date
    ) {}
}
