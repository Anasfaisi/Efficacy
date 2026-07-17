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
exports.ChatService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
const message_type_types_1 = require("@/types/message-type.types");
let ChatService = class ChatService {
    _chatRepository;
    _userRepository;
    _mentorshipRepository;
    constructor(_chatRepository, _userRepository, _mentorshipRepository) {
        this._chatRepository = _chatRepository;
        this._userRepository = _userRepository;
        this._mentorshipRepository = _mentorshipRepository;
    }
    async validateActiveMentorship(userId, mentorId) {
        const activeMentorship = await this._mentorshipRepository.findByUserIdAndMentorId(mentorId, userId);
        if (!activeMentorship) {
            throw new Error(response_messages_types_1.ErrorMessages.ActiveMentorshipRequired);
        }
        const allowedStatuses = ['active', 'completed'];
        if (!allowedStatuses.includes(activeMentorship.status)) {
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotActiveOrCompleted);
        }
    }
    async initiateChat(userId, mentorId) {
        await this.validateActiveMentorship(userId, mentorId);
        const participantsPayload = [
            { _id: userId, onModel: 'Users' },
            { _id: mentorId, onModel: 'Mentors' },
        ];
        const existing = await this._chatRepository.findConversationByParticipants(participantsPayload);
        if (existing)
            return existing;
        return this._chatRepository.createConversation(participantsPayload);
    }
    async getUserConversations(userId) {
        const result = await this._chatRepository.getUserConversations(userId);
        return result;
    }
    async getRoomMessages(roomId, userId, limit = 50, skip = 0) {
        const conversation = await this._chatRepository.getConversationById(roomId);
        if (!conversation)
            throw new Error(response_messages_types_1.ErrorMessages.ChatRoomNotFound);
        const isParticipant = conversation.participants.some((p) => p._id.toString() === userId || p.toString() === userId);
        if (!isParticipant)
            throw new Error(response_messages_types_1.ErrorMessages.AccessDenied);
        return this._chatRepository.getMessages(roomId, limit, skip);
    }
    async sendMessage(senderId, roomId, content, type = message_type_types_1.MessageType.TEXT) {
        const message = await this._chatRepository.createMessage({
            conversationId: roomId,
            senderId: senderId,
            content,
            type,
            isRead: false,
        });
        await this._chatRepository.updateLastMessage(roomId, message.id);
        return message;
    }
    async validateRoomAccess(roomId, userId) {
        const conversation = await this._chatRepository.getConversationById(roomId);
        if (!conversation)
            return false;
        const isParticipant = conversation.participants.some((p) => p._id.toString() === userId || p.toString() === userId);
        return isParticipant;
    }
    async deleteMessage(userId, messageId) {
        const message = await this._chatRepository.getMessageById(messageId);
        if (!message)
            throw new Error(response_messages_types_1.ErrorMessages.MessageNotFound);
        if (message.senderId.toString() !== userId) {
            throw new Error(response_messages_types_1.ErrorMessages.DeleteOwnMessagesOnly);
        }
        const deleted = await this._chatRepository.deleteMessage(messageId);
        if (!deleted)
            throw new Error(response_messages_types_1.ErrorMessages.DeleteMessageFailed);
        return deleted;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.ChatRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserRepository)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorshipRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ChatService);
//# sourceMappingURL=chat.service.js.map