import { MentorApplicationRequestDto } from '@/dto/mentorRequest.dto';
import { MentorApplicationResponseDto } from '@/dto/mentorResponse.dto';

export interface IMentorOnboardService {
    mentorApplicationInit(
        dto: MentorApplicationRequestDto
    ): Promise<MentorApplicationResponseDto | null>;
    activateMentor(mentorId: string, monthlyCharge: number): Promise<any>;
}
