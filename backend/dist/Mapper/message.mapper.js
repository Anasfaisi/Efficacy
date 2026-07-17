"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMapper = void 0;
const message_entity_1 = require("@/entity/message.entity");
const mongoose_1 = require("mongoose");
class MessageMapper {
    static toEntity(doc) {
        return new message_entity_1.MessageEntity(doc._id.toString(), doc.conversationId.toString(), doc.senderId.toString(), doc.content, doc.isRead, doc.type, doc.createdAt ?? new Date(), doc.updatedAt ?? new Date());
    }
    static toPersistence(messageData) {
        return {
            _id: new mongoose_1.Types.ObjectId(messageData.id),
            conversationId: new mongoose_1.Types.ObjectId(messageData.conversationId),
            senderId: new mongoose_1.Types.ObjectId(messageData.senderId),
            content: messageData.content,
            isRead: messageData.isRead,
            type: messageData.type,
        };
    }
    static toPopulatedEntity(messageData) {
        // Cast the populated senderId to its expected structure
        const sender = messageData.senderId;
        return {
            id: messageData.id,
            conversationId: messageData.conversationId.toString(),
            senderId: sender?._id
                ? sender._id.toString()
                : messageData.senderId?.toString(),
            content: messageData.content,
            isRead: messageData.isRead,
            type: messageData.type,
            createdAt: messageData.createdAt ?? new Date(),
            updatedAt: messageData.updatedAt ?? new Date(),
            senderName: sender?.name,
        };
    }
}
exports.MessageMapper = MessageMapper;
//# sourceMappingURL=message.mapper.js.map