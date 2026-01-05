import { MentorApplicationResponseDto } from '@/Dto/mentorResponse.dto';
import { IMentor } from '@/models/Mentor.model';

export interface IAdminService {
    getMentorApplications(): Promise<MentorApplicationResponseDto[]>;
    getMentorApplicationById(
        id: string
    ): Promise<MentorApplicationResponseDto | null>;

    approveMentorApplication(id: string): Promise<void>;
    rejectMentorApplication(id: string, reason: string): Promise<void>;
    requestChangesMentorApplication(id: string, reason: string): Promise<void>;
    getAllMentors(): Promise<MentorApplicationResponseDto[]>;
    getMentorById(id: string): Promise<MentorApplicationResponseDto | null>;
    updateMentorStatus(id: string, status: string): Promise<void>;
}
