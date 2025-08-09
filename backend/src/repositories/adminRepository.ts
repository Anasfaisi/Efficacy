import { BaseRepository } from './baseRepository';
import { IUserRepository } from './interfaces/IUserRepository';
import AdminModel, { IAdmin } from '../models/Admin';

export class AdminRepository extends BaseRepository implements IUserRepository {
  constructor() {
    super(AdminModel);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.findOne({ email });
  }
  async findById(id: string): Promise<IAdmin | null> {
    return super.findById(id);
  }

  async createUser(data: { email: string; password: string; name: string; role: string }): Promise<IAdmin> {
    return this.create(data);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.updateOne(id, { refreshToken });
  }
  
}