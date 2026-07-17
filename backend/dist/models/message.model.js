"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const message_type_types_1 = require("@/types/message-type.types");
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enum: Object.values(message_type_types_1.MessageType),
        default: message_type_types_1.MessageType.TEXT,
    },
}, { timestamps: true });
exports.MessageModel = (0, mongoose_1.model)('Message', MessageSchema);
//# sourceMappingURL=message.model.js.map