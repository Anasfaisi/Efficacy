import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';

export const Role = {user:"user",mentor:"mentor",admin:"admin"},
export type Repositories =
    | IAdminRepository<T>
    | IUserRepository
    | IMentorRepository;
