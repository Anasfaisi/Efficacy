import { IReview } from '@/models/Review.model';
import { ReviewEntity } from '@/entity/review.entity';
import { ReviewResponseDto, CreateReviewRequestDto } from '@/Dto/review.dto';
import { ReviewStatus } from '@/types/review-status.types';
import { Types } from 'mongoose';

export class ReviewMapper {
    static toEntity(doc: IReview): ReviewEntity {
        return new ReviewEntity(
            doc.id,
            doc.bookingId.toString(),
            doc.mentorId.toString(),
            doc.userId.toString(),
            doc.rating,
            doc.comment,
            doc.status,
            doc.isDeleted,
            doc.reviewWindowOpensAt,
            doc.reviewWindowExpiresAt,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static fromCreateDto(dto: CreateReviewRequestDto): ReviewEntity {
        return new ReviewEntity(
            undefined,
            dto.bookingId,
            dto.mentorId,
            dto.userId,
            dto.rating,
            dto.comment,
            ReviewStatus.PUBLISHED,
            false,
            new Date(),
            undefined
        );
    }

    static toPersistence(entity: Partial<ReviewEntity>): Partial<IReview> {
        const persistence: Partial<IReview> = {};
        if (entity.bookingId)
            persistence.bookingId = new Types.ObjectId(entity.bookingId);
        if (entity.mentorId)
            persistence.mentorId = new Types.ObjectId(entity.mentorId);
        if (entity.userId)
            persistence.userId = new Types.ObjectId(entity.userId);

        if (entity.rating !== undefined) persistence.rating = entity.rating;
        if (entity.comment) persistence.comment = entity.comment;
        if (entity.status) persistence.status = entity.status;
        if (entity.isDeleted !== undefined)
            persistence.isDeleted = entity.isDeleted;
        if (entity.reviewWindowOpensAt)
            persistence.reviewWindowOpensAt = entity.reviewWindowOpensAt;
        if (entity.reviewWindowExpiresAt)
            persistence.reviewWindowExpiresAt = entity.reviewWindowExpiresAt;

        return persistence;
    }

    static toResponseDto(entity: ReviewEntity): ReviewResponseDto {
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
