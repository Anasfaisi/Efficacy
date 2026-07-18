import { Schema, model, Document, Types } from 'mongoose';
import { ReviewStatus } from '@/types/review-status.types';

export interface IReview extends Document {
    bookingId: Types.ObjectId;
    mentorId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    status: ReviewStatus;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    reviewWindowOpensAt: Date;
    reviewWindowExpiresAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            unique: true,
        },
        mentorId: {
            type: Schema.Types.ObjectId,
            ref: 'Mentors',
            required: true,
        },
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(ReviewStatus),
            default: ReviewStatus.PUBLISHED,
        },
        isDeleted: { type: Boolean, default: false },
        reviewWindowOpensAt: { type: Date, default: Date.now },
        reviewWindowExpiresAt: { type: Date },
    },
    { timestamps: true }
);

reviewSchema.index({ mentorId: 1, createdAt: -1 });

export default model<IReview>('Review', reviewSchema);
