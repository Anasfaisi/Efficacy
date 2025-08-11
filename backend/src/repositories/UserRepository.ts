import { BaseRepository } from './baseRepository';
import { IUserRepository } from './interfaces/IUserRepository';
import UserModel, { IUser } from "../models/User";

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async createUser(data: { email: string; password: string; name: string; role: string }): Promise<IUser> {
    return this.create(data);
  }
  async findById(id: string): Promise<IUser | null> {
    return this.findById(id);
  }

  
}
