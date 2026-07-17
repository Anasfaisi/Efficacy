"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const base_repository_1 = require("./base.repository");
const conversation_model_1 = require("@/models/conversation.model");
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const mongoose_1 = require("mongoose");
const message_mapper_1 = require("@/Mapper/message.mapper");
let ChatRepository = class ChatRepository extends base_repository_1.BaseRepository {
    _messageRepository;
    constructor(_messageRepository) {
        super(conversation_model_1.ConversationModel);
        this._messageRepository = _messageRepository;
    }
    async createConversation(participants) {
        const newConversation = await this.model.create({
            participants,
        });
        await newConversation.populate('participants._id', 'name profilePic role email');
        const convObject = newConversation.toObject();
        return {
            ...convObject,
            participants: convObject.participants.map((p) => p._id),
        };
    }
    async findConversationByParticipants(participants) {
        const participantIds = participants.map((p) => p._id);
        const conversation = await this.model
            .findOne({
            participants: { $size: participantIds.length },
            'participants._id': { $all: participantIds },
        })
            .populate('participants._id', 'name profilePic role email')
            .lean();
        if (!conversation)
            return null;
        return {
            ...conversation,
            participants: conversation.participants.map((p) => p._id),
        };
    }
    async getUserConversations(userId) {
        const conversations = await this.model
            .find({
            'participants._id': userId,
        })
            .populate('participants._id', 'name profilePic role email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .lean();
        return conversations.map((conv) => ({
            ...conv,
            participants: conv.participants.map((p) => p._id),
        }));
    }
    async getConversationById(id) {
        const conversation = await this.model
            .findById(id)
            .populate('participants._id', 'name profilePic role email')
            .lean();
        if (!conversation)
            return null;
        return {
            ...conversation,
            participants: conversation.participants.map((p) => p._id),
        };
    }
    async createMessage(data) {
        const persistence = message_mapper_1.MessageMapper.toPersistence(data);
        const message = await this._messageRepository.create(persistence);
        const conversation = await this.model
            .findById(data.conversationId)
            .populate('participants._id', 'name')
            .lean();
        let senderName = '';
        if (conversation) {
            const participant = conversation.participants.find((p) => p._id._id.toString() === data.senderId);
            if (participant)
                senderName = participant._id.name;
        }
        const populatedEntity = message_mapper_1.MessageMapper.toPopulatedEntity(message);
        populatedEntity.senderName = senderName;
        return populatedEntity;
    }
    async getMessages(conversationId, limit = 50, skip = 0) {
        const messages = await this._messageRepository.findByChat(conversationId);
        const conversation = await this.model
            .findById(conversationId)
            .populate('participants._id', 'name')
            .lean();
        const participantsMap = new Map();
        if (conversation) {
            conversation.participants.forEach((p) => {
                participantsMap.set(p._id._id.toString(), p._id.name);
            });
        }
        const paginatedMessages = messages.slice(skip, skip + limit);
        return paginatedMessages.map((msg) => {
            const msgObj = msg.toObject ? msg.toObject() : msg;
            const senderIdStr = msgObj.senderId.toString();
            return {
                ...msgObj,
                senderName: participantsMap.get(senderIdStr),
                senderId: senderIdStr,
            };
        });
    }
    async markMessagesAsRead(conversationId, userId) {
        (await this._messageRepository.updateMany({ conversationId, senderId: { $ne: userId }, isRead: false }, { isRead: true }));
    }
    async updateLastMessage(conversationId, messageId) {
        await this.update(conversationId, {
            lastMessage: new mongoose_1.Types.ObjectId(messageId),
        });
    }
    async deleteMessage(messageId) {
        await this._messageRepository.deleteOne(messageId);
        return null;
    }
    async getMessageById(messageId) {
        return this._messageRepository.findById(messageId);
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MessageRepository)),
    __metadata("design:paramtypes", [Object])
], ChatRepository);
//# sourceMappingURL=chat.repository.js.map