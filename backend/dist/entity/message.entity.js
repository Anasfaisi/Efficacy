"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEntity = void 0;
class MessageEntity {
    id;
    conversationId;
    senderId;
    content;
    isRead;
    type;
    createdAt;
    updatedAt;
    constructor(id, conversationId, senderId, content, isRead, type, createdAt, updatedAt) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.isRead = isRead;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.MessageEntity = MessageEntity;
//# sourceMappingURL=message.entity.js.map