"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationEntity = exports.ParticipantEntity = void 0;
class ParticipantEntity {
    id;
    onModel;
    name;
    profilePic;
    email;
    constructor(id, onModel, name, profilePic, email) {
        this.id = id;
        this.onModel = onModel;
        this.name = name;
        this.profilePic = profilePic;
        this.email = email;
    }
}
exports.ParticipantEntity = ParticipantEntity;
class ConversationEntity {
    id;
    participants;
    isActive;
    lastMessage;
    createdAt;
    updatedAt;
    constructor(id, participants, isActive, lastMessage, createdAt, updatedAt) {
        this.id = id;
        this.participants = participants;
        this.isActive = isActive;
        this.lastMessage = lastMessage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.ConversationEntity = ConversationEntity;
//# sourceMappingURL=conversation.entity.js.map