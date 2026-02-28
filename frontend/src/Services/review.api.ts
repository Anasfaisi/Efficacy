import api from './axiosConfig';

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
    createdAt?: string;
    updatedAt?: string;
}

export interface Review {
    _id: string;
    bookingId: any;
    mentorId: any;
    userId: {
        _id: string;
        name: string;
        profilePic?: string;
    } | any;
    rating: number;
    comment: string;
    createdAt: string;
}

export const reviewApi = {
    getMentorReviews: async (mentorId: string): Promise<Review[]> => {
        const res = await api.get(`/reviews/mentor/${mentorId}`);
        return res.data.data;
    },
    submitReview: async (dto: CreateReviewRequestDto): Promise<ReviewResponseDto> => {
        const res = await api.post('/reviews', dto);
        return res.data.data;
    }
};
