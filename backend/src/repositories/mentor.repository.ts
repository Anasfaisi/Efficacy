import { BaseRepository } from './base.repository';
import MentorModel, { IMentor } from '@/models/Mentor.model';
import { IMentorRepository } from './interfaces/IMentor.repository';

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
    async findById(id: string): Promise<IMentor | null> {
        return super.findById(id);
    }

    async update(id: string, data: Partial<IMentor>): Promise<IMentor | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async getAllMentors(): Promise<IMentor[]> {
        return this.model.find({
            status: { $in: ['active', 'inactive'] }
        }).exec();
    }
    async findAllApprovedMentors(
        page: number,
        limit: number,
        search: string,
        sort: string,
        filter: any
    ): Promise<{ mentors: IMentor[]; total: number; pages: number }> {
        const query: any = { status:'active'};

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
