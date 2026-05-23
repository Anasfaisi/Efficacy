import { IMentor } from '@/models/mentor.model';
import { UpdateMentorProfileDto } from '@/dto/mentorRequest.dto';

export interface IMentorService {
    getMentorProfile(id: string): Promise<IMentor>;
    updateMentorProfileBasicInfo(
        id: string,
        data: UpdateMentorProfileDto
    ): Promise<IMentor>;
    updateMentorProfileMedia(id: string, files: any): Promise<IMentor>;
    updateMentorProfileArray(
        id: string,
        field: string,
        data: any[]
    ): Promise<IMentor>;
    getApprovedMentors(
        page: number,
        limit: number,
        search: string,
        sort: string,
        filter: any
    ): Promise<{ mentors: IMentor[]; total: number; pages: number }>;
    getMentorById(id: string): Promise<IMentor | null>;
}
