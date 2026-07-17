"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewEntity = void 0;
class ReviewEntity {
    id;
    bookingId;
    mentorId;
    userId;
    rating;
    comment;
    status;
    isDeleted;
    reviewWindowOpensAt;
    reviewWindowExpiresAt;
    createdAt;
    updatedAt;
    constructor(id, bookingId, mentorId, userId, rating, comment, status, isDeleted, reviewWindowOpensAt, reviewWindowExpiresAt, createdAt, updatedAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.mentorId = mentorId;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
        this.status = status;
        this.isDeleted = isDeleted;
        this.reviewWindowOpensAt = reviewWindowOpensAt;
        this.reviewWindowExpiresAt = reviewWindowExpiresAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.ReviewEntity = ReviewEntity;
//# sourceMappingURL=review.entity.js.map