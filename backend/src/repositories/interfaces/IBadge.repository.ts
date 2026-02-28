import { IBaseRepository } from './IBase.repository';
import { IBadge } from '@/types/gamification.types';
import { Types } from 'mongoose';

export interface IBadgeRepository extends IBaseRepository<IBadge> {
    getAllBadgesAdmin(): Promise<IBadge[]>;
}
