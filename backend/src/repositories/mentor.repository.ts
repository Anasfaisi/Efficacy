import { BaseRepository } from './base.repository';
import MentorModel, { IMentor } from '@/models/Mentor.model';
import { IMentorRepository } from './interfaces/IMentor.repository';

export class MentorRepository
    extends BaseRepository
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
        return this.findById(id);
    }
}
