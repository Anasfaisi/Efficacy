import { IMentor } from "@/models/Mentor";

export interface IMentorRepository {
  findByEmail(email: string): Promise<IMentor|null>;
  findById(id: string): Promise<IMentor|null>;
  createUser(data: { email: string; password: string; name: string; role: string }): Promise<IMentor>;
}
