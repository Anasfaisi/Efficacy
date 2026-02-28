import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import { IBadgeRepository } from './interfaces/IBadge.repository';
import { Badge } from '@/models/Badge.model';
import { IBadge } from '@/types/gamification.types';

@injectable()
export class BadgeRepository extends BaseRepository<IBadge> implements IBadgeRepository {
    constructor() {
        super(Badge);
    }
    
    async getAllBadgesAdmin(): Promise<IBadge[]> {
        return this.model.find().sort({ createdAt: -1 }).exec();
    }
}
