"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const base_repository_1 = require("./base.repository");
const review_model_1 = __importDefault(require("@/models/review.model"));
const review_status_types_1 = require("@/types/review-status.types");
const review_mapper_1 = require("@/Mapper/review.mapper");
class ReviewRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(review_model_1.default);
    }
    async createReview(data) {
        const persistenceData = review_mapper_1.ReviewMapper.toPersistence(data);
        const doc = await this.model.create(persistenceData);
        return review_mapper_1.ReviewMapper.toEntity(doc);
    }
    async getAverageRating(mentorId) {
        const stats = await this.model.aggregate([
            {
                $match: {
                    mentorId: mentorId,
                    isDeleted: false,
                    status: review_status_types_1.ReviewStatus.PUBLISHED,
                },
            },
            {
                $group: {
                    _id: '$mentorId',
                    reviewCount: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                },
            },
        ]);
        if (stats.length > 0) {
            return {
                averageRating: Math.round(stats[0].averageRating * 10) / 10,
                reviewCount: stats[0].reviewCount,
            };
        }
        return {
            averageRating: 0,
            reviewCount: 0,
        };
    }
}
exports.ReviewRepository = ReviewRepository;
//# sourceMappingURL=review.repository.js.map