"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewMapper = void 0;
const review_entity_1 = require("@/entity/review.entity");
const review_status_types_1 = require("@/types/review-status.types");
const mongoose_1 = require("mongoose");
class ReviewMapper {
    static toEntity(doc) {
        return new review_entity_1.ReviewEntity(doc.id, doc.bookingId.toString(), doc.mentorId.toString(), doc.userId.toString(), doc.rating, doc.comment, doc.status, doc.isDeleted, doc.reviewWindowOpensAt, doc.reviewWindowExpiresAt, doc.createdAt, doc.updatedAt);
    }
    static fromCreateDto(dto) {
        return new review_entity_1.ReviewEntity(undefined, dto.bookingId, dto.mentorId, dto.userId, dto.rating, dto.comment, review_status_types_1.ReviewStatus.PUBLISHED, false, new Date(), undefined);
    }
    static toPersistence(entity) {
        const persistence = {};
        if (entity.bookingId)
            persistence.bookingId = new mongoose_1.Types.ObjectId(entity.bookingId);
        if (entity.mentorId)
            persistence.mentorId = new mongoose_1.Types.ObjectId(entity.mentorId);
        if (entity.userId)
            persistence.userId = new mongoose_1.Types.ObjectId(entity.userId);
        if (entity.rating !== undefined)
            persistence.rating = entity.rating;
        if (entity.comment)
            persistence.comment = entity.comment;
        if (entity.status)
            persistence.status = entity.status;
        if (entity.isDeleted !== undefined)
            persistence.isDeleted = entity.isDeleted;
        if (entity.reviewWindowOpensAt)
            persistence.reviewWindowOpensAt = entity.reviewWindowOpensAt;
        if (entity.reviewWindowExpiresAt)
            persistence.reviewWindowExpiresAt = entity.reviewWindowExpiresAt;
        return persistence;
    }
    static toResponseDto(entity) {
        return {
            id: entity.id,
            bookingId: entity.bookingId,
            mentorId: entity.mentorId,
            userId: entity.userId,
            rating: entity.rating,
            comment: entity.comment,
            status: entity.status,
            reviewWindowOpensAt: entity.reviewWindowOpensAt,
            reviewWindowExpiresAt: entity.reviewWindowExpiresAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.ReviewMapper = ReviewMapper;
//# sourceMappingURL=review.mapper.js.map