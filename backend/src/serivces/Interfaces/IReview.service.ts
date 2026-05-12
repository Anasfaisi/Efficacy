import { ReviewResponseDto, CreateReviewRequestDto } from '@/dto/review.dto';

export interface IReviewService {
    submitReview(dto: CreateReviewRequestDto): Promise<ReviewResponseDto>;
    getMentorReviews(mentorId: string): Promise<ReviewResponseDto[]>;
}
