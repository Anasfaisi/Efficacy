"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorShipMapper = void 0;
const extractId_1 = require("@/utils/extractId");
const mongoose_1 = require("mongoose");
class MentorShipMapper {
    static toEntity(doc) {
        return {
            id: doc.id,
            userId: doc.userId,
            mentorId: doc.mentorId,
            proposedStartDate: doc.proposedStartDate,
            status: doc.status,
            amount: doc.amount,
            paymentStatus: doc.paymentStatus,
            paymentId: doc.paymentId,
            usedSessions: doc.usedSessions,
            totalSessions: doc.totalSessions,
            userConfirmedCompletion: doc.userConfirmedCompletion,
            mentorConfirmedCompletion: doc.mentorConfirmedCompletion,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
    static toPersistence(entity) {
        return {
            id: entity.id,
            userId: new mongoose_1.Types.ObjectId((0, extractId_1.extractId)(entity.userId)),
            mentorId: new mongoose_1.Types.ObjectId((0, extractId_1.extractId)(entity.mentorId)),
            proposedStartDate: entity.proposedStartDate,
            status: entity.status,
            amount: entity.amount,
            paymentStatus: entity.paymentStatus,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.MentorShipMapper = MentorShipMapper;
//# sourceMappingURL=mentorship.mapper.js.map