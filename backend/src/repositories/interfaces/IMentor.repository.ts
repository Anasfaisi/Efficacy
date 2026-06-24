import { IMentor } from '@/models/mentor.model';
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
        filter: {
            expertise?: { $regex: string; $options: string };
            monthlyCharge?: { $gte?: number; $lte?: number };
            rating?: { $gte: number };
        }
    ): Promise<{ mentors: IMentor[]; total: number; pages: number }>;
}
