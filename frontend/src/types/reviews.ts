export interface CreateReviewRequestDto {
    bookingId: string;
    mentorId: string;
    userId: string;
    rating: number;
    comment: string;
}

export interface ReviewResponseDto {
    id?: string;
    bookingId?: string;
    mentorId?: string;
    userId?: string;
    rating?: number;
    comment?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Review {
    _id: string;
    bookingId: string;
    mentorId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
}
