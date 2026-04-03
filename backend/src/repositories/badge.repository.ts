import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import { IBadgeRepository } from './interfaces/IBadge.repository';
import { Badge } from '@/models/Badge.model';
import { IBadge } from '@/types/gamification.types';

@injectable()
export class BadgeRepository
    extends BaseRepository<IBadge>
    implements IBadgeRepository
{
    constructor() {
        super(Badge);
    }

    async getAllBadgesAdmin(page: number, limit: number): Promise<{ badges: IBadge[], total: number }> {
        const skip = (page - 1) * limit;
        const total = await this.model.countDocuments();
        const badges = await this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
        return { badges, total };
    }
}
