import { IMentorship } from '@/models/Mentorship.model';
import { IBaseRepository } from './IBase.repository';
import { ObjectId } from 'mongoose';

export interface IMentorshipRepository extends IBaseRepository<IMentorship> {
    findByUserId(userId: string | ObjectId): Promise<IMentorship[]>;
    findByMentorId(mentorId: string | ObjectId): Promise<IMentorship[]>;
    findActiveByUserId(userId: string | ObjectId): Promise<IMentorship | null>;
    findActiveByMentorId(mentorId: string | ObjectId): Promise<IMentorship[]>;
    findByUserIdAndMentorId(
        mentorId: string | ObjectId,
        userId: string | ObjectId
    ): Promise<IMentorship | null>;
    findPaginatedByMentorId(
        mentorId: string | ObjectId,
        page: number,
        limit: number,
        status?: string,
        search?: string
    ): Promise<{ mentorships: IMentorship[]; total: number }>;
}
