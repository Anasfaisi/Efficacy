import { ReviewStatus } from '@/types/review-status.types';

export interface CreateReviewRequestDto {
    bookingId: string;
    mentorId: string;
    userId: string;
    rating: number;
    comment: string;
}

export interface ReviewResponseDto {
    id?: string;
    bookingId?: string | any;
    mentorId?: string | any;
    userId?: string | any;
    rating?: number;
    comment?: string;
    status?: ReviewStatus;
    reviewWindowOpensAt?: Date;
    reviewWindowExpiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
