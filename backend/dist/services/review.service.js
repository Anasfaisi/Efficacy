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
exports.ReviewService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const review_mapper_1 = require("@/Mapper/review.mapper");
const review_status_types_1 = require("@/types/review-status.types");
const mongoose_1 = require("mongoose");
const booking_status_types_1 = require("@/types/booking-status.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let ReviewService = class ReviewService {
    _reviewRepository;
    _mentorRepository;
    _bookingRepository;
    constructor(_reviewRepository, _mentorRepository, _bookingRepository) {
        this._reviewRepository = _reviewRepository;
        this._mentorRepository = _mentorRepository;
        this._bookingRepository = _bookingRepository;
    }
    async submitReview(dto) {
        const reviewEntity = review_mapper_1.ReviewMapper.fromCreateDto(dto);
        const booking = await this._bookingRepository.findById(reviewEntity.bookingId);
        if (!booking) {
            throw new Error(response_messages_types_1.ErrorMessages.BookingNotFound);
        }
        const validStatuses = [
            booking_status_types_1.BookingStatus.COMPLETED,
            booking_status_types_1.BookingStatus.MISSED_BY_MENTOR,
        ];
        if (!validStatuses.includes(booking.status)) {
            throw new Error(response_messages_types_1.ErrorMessages.BookingInvalidStatus);
        }
        const existingReview = await this._reviewRepository.findOne({
            bookingId: new mongoose_1.Types.ObjectId(reviewEntity.bookingId),
        });
        if (existingReview) {
            throw new Error('Review already exists for this booking');
        }
        await this._reviewRepository.createReview(reviewEntity);
        const stats = await this._reviewRepository.getAverageRating(new mongoose_1.Types.ObjectId(reviewEntity.mentorId));
        await this._mentorRepository.update(reviewEntity.mentorId, {
            rating: stats.averageRating,
            reviewCount: stats.reviewCount,
        });
        return review_mapper_1.ReviewMapper.toResponseDto(reviewEntity);
    }
    async getMentorReviews(mentorId) {
        const reviews = await this._reviewRepository.find({
            mentorId: new mongoose_1.Types.ObjectId(mentorId),
            isDeleted: false,
            status: review_status_types_1.ReviewStatus.PUBLISHED,
        });
        return reviews.map((doc) => {
            const entity = review_mapper_1.ReviewMapper.toEntity(doc);
            return review_mapper_1.ReviewMapper.toResponseDto(entity);
        });
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.ReviewRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorRepository)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BookingRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ReviewService);
//# sourceMappingURL=review.service.js.map