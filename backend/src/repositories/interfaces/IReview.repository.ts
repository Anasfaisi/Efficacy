import { IReview } from '@/models/Review.model';
import { IBaseRepository } from './IBase.repository';
import { ReviewEntity } from '@/entity/review.entity';
import { Types } from 'mongoose';

export interface IReviewRepository extends IBaseRepository<IReview> {
    getAverageRating(
        mentorId: Types.ObjectId
    ): Promise<{ averageRating: number; reviewCount: number }>;
    createReview(data: ReviewEntity): Promise<ReviewEntity>;
}
