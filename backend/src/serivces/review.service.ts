import { injectable, inject } from 'inversify';
import { IReviewService } from './Interfaces/IReview.service';
import { IReviewRepository } from '@/repositories/interfaces/IReview.repository';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IBookingRepository } from '@/repositories/interfaces/IBooking.repository';
import { TYPES } from '@/config/inversify-key.types';
import { CreateReviewRequestDto, ReviewResponseDto } from '@/Dto/review.dto';
import { ReviewMapper } from '@/Mapper/review.mapper';
import { ReviewStatus } from '@/types/review-status.types';
import { Types } from 'mongoose';
import { BookingStatus } from '@/types/booking-status.types';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class ReviewService implements IReviewService {
    constructor(
        @inject(TYPES.ReviewRepository)
        private _reviewRepository: IReviewRepository,
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository,
        @inject(TYPES.BookingRepository)
        private _bookingRepository: IBookingRepository
    ) {}

    async submitReview(
        dto: CreateReviewRequestDto
    ): Promise<ReviewResponseDto> {
        const reviewEntity = ReviewMapper.fromCreateDto(dto);

        const booking = await this._bookingRepository.findById(
            reviewEntity.bookingId!
        );
        if (!booking) {
            throw new Error(ErrorMessages.BookingNotFound);
        }

        const validStatuses = [
            BookingStatus.COMPLETED,
            BookingStatus.MISSED_BY_MENTOR,
        ];
        if (!validStatuses.includes(booking.status as BookingStatus)) {
            throw new Error(ErrorMessages.BookingInvalidStatus);
        }

        const existingReview = await this._reviewRepository.findOne({
            bookingId: new Types.ObjectId(reviewEntity.bookingId),
        });
        if (existingReview) {
            throw new Error('Review already exists for this booking');
        }

        await this._reviewRepository.createReview(reviewEntity);

        const stats = await this._reviewRepository.getAverageRating(
            new Types.ObjectId(reviewEntity.mentorId)
        );

        await this._mentorRepository.update(reviewEntity.mentorId!, {
            rating: stats.averageRating,
            reviewCount: stats.reviewCount,
        });
        return ReviewMapper.toResponseDto(reviewEntity);
    }

    async getMentorReviews(mentorId: string): Promise<ReviewResponseDto[]> {
        const reviews = await this._reviewRepository.find({
            mentorId: new Types.ObjectId(mentorId),
            isDeleted: false,
            status: ReviewStatus.PUBLISHED,
        });

        return reviews.map((doc) => {
            const entity = ReviewMapper.toEntity(doc);
            return ReviewMapper.toResponseDto(entity);
        });
    }
}
