import { IUserBadge, UserBadge } from '@/models/UserBadge.model';
import { BaseRepository } from '../base.repository';
import { IUserBadgeRepository } from './interfaces/IUser-badge.repository';

export class UserBadgeRepository
    extends BaseRepository<IUserBadge>
    implements IUserBadgeRepository
{
    constructor() {
        super(UserBadge);
    }
    async findExistingBadge(badgeId: string): Promise<IUserBadge|null> {
        return this.model.findOne({badgeId : badgeId})
    }
}
