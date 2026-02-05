import { IMentor } from '@/models/Mentor.model';
import { IBaseRepository } from './IBase.repository';

export interface IMentorRepository extends IBaseRepository<IMentor> {
    findByEmail(email: string): Promise<IMentor | null>;
    findById(id: string): Promise<IMentor | null>;
    createUser(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<IMentor>;

    update(id: string, data: Partial<IMentor>): Promise<IMentor | null>;
    getAllMentors(
        page: number,
        limit: number,
        search?: string,
        filters?: { status?: string; mentorType?: string }
    ): Promise<{ mentors: IMentor[]; total: number }>;
    getMentorApplications(
        page: number,
        limit: number,
        search?: string,
        filters?: { status?: string; mentorType?: string }
    ): Promise<{ mentors: IMentor[]; total: number }>;
    findAllApprovedMentors(
        page: number,
        limit: number,
        search: string,
        sort: string,
        filter: object
    ): Promise<{ mentors: IMentor[]; total: number; pages: number }>;
}
