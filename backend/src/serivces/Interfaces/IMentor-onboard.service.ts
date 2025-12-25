import { MentorApplicationRequestDto } from '@/Dto/mentorRequest.dto';
import { MentorApplicationResponseDto } from '@/Dto/mentorResponse.dto';

export interface IMentorOnboardService {
    mentorApplicationInit(
        dto: MentorApplicationRequestDto
    ): Promise<MentorApplicationResponseDto | null>;
}
