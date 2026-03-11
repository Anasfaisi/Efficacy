import { BaseRepository } from './base.repository';
import { IReviewRepository } from './interfaces/IReview.repository';
import Review, { IReview } from '@/models/Review.model';
import { ReviewStatus } from '@/types/review-status.types';
import { ReviewEntity } from '@/entity/review.entity';
import { ReviewMapper } from '@/Mapper/review.mapper';

export class ReviewRepository
    extends BaseRepository<IReview>
    implements IReviewRepository
{
    constructor() {
        super(Review);
    }
    async createReview(data: ReviewEntity): Promise<ReviewEntity> {
        const persistenceData = ReviewMapper.toPersistence(data);
        const doc = await this.model.create(persistenceData);
        return ReviewMapper.toEntity(doc);
    }

    async getAverageRating(
        mentorId: any
    ): Promise<{ averageRating: number; reviewCount: number }> {
        const stats = await this.model.aggregate([
            {
                $match: {
                    mentorId: mentorId,
                    isDeleted: false,
                    status: ReviewStatus.PUBLISHED,
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
        console.log(stats, 'stats from reveiw repo');
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
