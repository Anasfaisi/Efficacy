import { MessageType } from '@/types/message-type.types';

export class MessageEntity {
    constructor(
        public id: string,
        public conversationId: string,
        public senderId: string,
        public content: string,
        public isRead: boolean,
        public type: MessageType,
        public createdAt: Date,
        public updatedAt: Date
    ) {}
}

export interface PopulatedMessageEntity {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    type: MessageType;
    createdAt: Date;
    updatedAt: Date;
    senderName: string;
}
