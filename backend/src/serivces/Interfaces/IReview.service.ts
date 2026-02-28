import { ReviewResponseDto, CreateReviewRequestDto } from '@/Dto/review.dto';

export interface IReviewService {
    submitReview(dto: CreateReviewRequestDto): Promise<ReviewResponseDto>;
    getMentorReviews(mentorId: string): Promise<ReviewResponseDto[]>;
}
