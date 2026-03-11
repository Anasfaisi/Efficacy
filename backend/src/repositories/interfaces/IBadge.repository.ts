import { IBaseRepository } from './IBase.repository';
import { IBadge } from '@/types/gamification.types';

export interface IBadgeRepository extends IBaseRepository<IBadge> {
    getAllBadgesAdmin(): Promise<IBadge[]>;
}
