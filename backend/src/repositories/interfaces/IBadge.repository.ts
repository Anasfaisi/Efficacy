import { BadgeEntity } from '@/entity/badge.entity';
import { IBaseRepository } from './IBase.repository';
import { IBadge } from '@/models/badge.model';
import { FilterQuery } from 'mongoose';

export interface IBadgeRepository extends IBaseRepository<IBadge> {
    createBadge(badge: Partial<BadgeEntity>): Promise<BadgeEntity>;
    findBadges(query: FilterQuery<BadgeEntity>): Promise<BadgeEntity[]>;
    getAllBadgesAdmin(
        page: number,
        limit: number
    ): Promise<{ badges: IBadge[]; total: number }>;
}
