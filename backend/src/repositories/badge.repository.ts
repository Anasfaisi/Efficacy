import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import { IBadgeRepository } from './interfaces/IBadge.repository';
import { Badge, IBadge } from '@/models/Badge.model';
import { FilterQuery } from 'mongoose';
import { BadgeEntity } from '@/entity/badge.entity';
import { BadgeMapper } from '@/Mapper/badge.mapper';

@injectable()
export class BadgeRepository
    extends BaseRepository<IBadge>
    implements IBadgeRepository
{
    constructor() {
        super(Badge);
    }

    async getAllBadgesAdmin(
        page: number,
        limit: number
    ): Promise<{ badges: IBadge[]; total: number }> {
        const skip = (page - 1) * limit;
        const total = await this.model.countDocuments();
        const badges = await this.model
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return { badges, total };
    }

    async findBadges(query: FilterQuery<BadgeEntity>): Promise<BadgeEntity[]> {
        const badges = await super.find(query);
        return BadgeMapper.listtoBadgeEntity(badges);
    }
}
