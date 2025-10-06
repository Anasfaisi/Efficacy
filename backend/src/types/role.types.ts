import { IAdmin } from '@/models/Admin.model';
import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';

export enum Role {
    User = 'user',
    Mentor = 'mentor',
    Admin = 'admin',
}

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read',
}
export type Repositories =
    | IAdminRepository<IAdmin>
    | IUserRepository
    | IMentorRepository;
