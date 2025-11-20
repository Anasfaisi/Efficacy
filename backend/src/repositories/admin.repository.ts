import { BaseRepository } from './base.repository';
import AdminModel, { IAdmin } from '../models/Admin.model';
import { IAdminRepository } from './interfaces/IAdmin.repository';

export class AdminRepository
    extends BaseRepository<IAdmin>
    implements IAdminRepository<IAdmin>
{
    constructor() {
        super(AdminModel);
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        return this.model.findOne({ email });
    }
    async findById(id: string): Promise<IAdmin | null> {
        return super.findById(id);
    }

    async createUser(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<IAdmin> {
        return this.create(data);
    }
}
