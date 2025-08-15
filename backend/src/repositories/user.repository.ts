import { BaseRepository } from "./base.repository";
import { IUserRepository } from "./interfaces/IUser.repository";
import UserModel, { IUser } from "../models/User";
import { hashPassword } from "@/utils";

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser| null> {
    return await this.findOne({ email });
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: string;
  }): Promise<IUser> {
    return this.create(data);
  }
  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
   
   
  }
}
