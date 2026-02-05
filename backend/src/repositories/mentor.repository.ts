import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import MentorModel, { IMentor } from '@/models/Mentor.model';
import { IMentorRepository } from './interfaces/IMentor.repository';

@injectable()
export class MentorRepository
    extends BaseRepository<IMentor>
    implements IMentorRepository
{
    constructor() {
        super(MentorModel);
    }

    async findByEmail(email: string): Promise<IMentor | null> {
        return this.findOne({ email });
    }

    async createUser(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<IMentor> {
        return this.create(data);
    }

    async getAllMentors(
        page: number,
        limit: number,
        search?: string,
        filters?: { status?: string; mentorType?: string }
    ): Promise<{ mentors: IMentor[]; total: number }> {
        const query: any = { status: { $in: ['active', 'inactive'] } };

        if (filters?.status && filters.status !== 'all') {
            query.status = filters.status;
        }

        if (filters?.mentorType && filters.mentorType !== 'all') {
            query.mentorType = filters.mentorType;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;
        const total = await this.model.countDocuments(query);
        const mentors = await this.model
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        return { mentors, total };
    }

    async getMentorApplications(
        page: number,
        limit: number,
        search?: string,
        filters?: { status?: string; mentorType?: string }
    ): Promise<{ mentors: IMentor[]; total: number }> {
        const query: any = { status: { $ne: 'incomplete' } };

        if (filters?.status && filters.status !== 'all') {
            query.status = filters.status;
        }

        if (filters?.mentorType && filters.mentorType !== 'all') {
            query.mentorType = filters.mentorType;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;
        const total = await this.model.countDocuments(query);
        const mentors = await this.model
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        return { mentors, total };
    }
    async findAllApprovedMentors(
        page: number,
        limit: number,
        search: string,
        sort: string,
        filter: any
    ): Promise<{ mentors: IMentor[]; total: number; pages: number }> {
        const query: any = { status: 'active' };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { domain: { $regex: search, $options: 'i' } },
                { expertise: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } },
                { currentRole: { $regex: search, $options: 'i' } },
            ];
        }

        if (filter) {
            Object.assign(query, filter);
        }

        const sortOptions: any = {};
        if (sort) {
            const [field, order] = sort.split('_');
            const sortField = field === 'price' ? 'monthlyCharge' : field;
            sortOptions[sortField] = order === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const skip = (page - 1) * limit;

        const total = await this.model.countDocuments(query);
        const mentors = await this.model
            .find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();

        const pages = Math.ceil(total / limit);

        return { mentors, total, pages };
    }
}
