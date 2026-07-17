"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const review_status_types_1 = require("@/types/review-status.types");
const reviewSchema = new mongoose_1.Schema({
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true,
    },
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mentors',
        required: true,
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Users', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(review_status_types_1.ReviewStatus),
        default: review_status_types_1.ReviewStatus.PUBLISHED,
    },
    isDeleted: { type: Boolean, default: false },
    reviewWindowOpensAt: { type: Date, default: Date.now },
    reviewWindowExpiresAt: { type: Date },
}, { timestamps: true });
reviewSchema.index({ mentorId: 1, createdAt: -1 });
exports.default = (0, mongoose_1.model)('Review', reviewSchema);
//# sourceMappingURL=review.model.js.map