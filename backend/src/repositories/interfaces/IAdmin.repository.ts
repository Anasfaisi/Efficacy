import { IAdmin } from "@/models/Admin.model";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin|null>;
  findById(id: string): Promise<IAdmin|null>;
  createUser(data: { email: string; password: string; name: string; role: string }): Promise<IAdmin>;
}
