"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
const ParticipantSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'participants.onModel',
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Users', 'Mentors'],
    },
}, { _id: false });
const ConversationSchema = new mongoose_1.Schema({
    participants: [ParticipantSchema],
    isActive: { type: Boolean, default: true },
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
    },
}, { timestamps: true });
ConversationSchema.index({ participants: 1 });
exports.ConversationModel = (0, mongoose_1.model)('Conversation', ConversationSchema);
//# sourceMappingURL=conversation.model.js.map