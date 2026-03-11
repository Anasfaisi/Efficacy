import type {
    Review,
    CreateReviewRequestDto,
    ReviewResponseDto,
} from '@/types/reviews';
import api from './axiosConfig';
import { ReviewRoutes } from './constant.routes';

export const reviewApi = {
    getMentorReviews: async (mentorId: string): Promise<Review[]> => {
        const res = await api.get(ReviewRoutes.MENTOR_REVIEWS(mentorId));
        return res.data.data;
    },
    submitReview: async (
        dto: CreateReviewRequestDto
    ): Promise<ReviewResponseDto> => {
        const res = await api.post(ReviewRoutes.CREATE_REVIEW, dto);
        return res.data.data;
    },
};
