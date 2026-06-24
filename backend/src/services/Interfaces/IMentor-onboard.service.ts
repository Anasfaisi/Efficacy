import { MentorApplicationRequestDto } from '@/dto/mentorRequest.dto';
import { MentorApplicationResponseDto } from '@/dto/mentorResponse.dto';
import { MentorEntity } from '@/entity/mentor.entity';

export interface IMentorOnboardService {
    mentorApplicationInit(
        dto: MentorApplicationRequestDto
    ): Promise<MentorApplicationResponseDto | null>;
    activateMentor(
        mentorId: string,
        monthlyCharge: number
    ): Promise<MentorEntity | null>;
}
