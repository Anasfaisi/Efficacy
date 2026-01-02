// backend/src/interfaces/unverifiedUserRepository.interface.ts

import { IUnverifiedUser } from '@/models/Unverified-user.model';
import { UpdateWriteOpResult } from 'mongoose';

export interface IUnverifiedUserRepository {
    findByEmail(email: string): Promise<IUnverifiedUser | null>;
    create(data: Partial<IUnverifiedUser>): Promise<IUnverifiedUser>;
    deleteByEmail(email: string): Promise<{ deletedCount?: number }>;
    updateByEmail(
        email: string,
        update: Partial<IUnverifiedUser>
    ): Promise<IUnverifiedUser | null>;
}
