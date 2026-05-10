import { IUserBadge, UserBadge } from '@/models/UserBadge.model';
import { BaseRepository } from '../base.repository';
import { IUserBadgeRepository } from './interfaces/IUser-badge.repository';
import { Types } from 'mongoose';

export class UserBadgeRepository
    extends BaseRepository<IUserBadge>
    implements IUserBadgeRepository
{
    constructor() {
        super(UserBadge);
    }
    async findExistingBadge(badgeId: string): Promise<IUserBadge | null> {
        return this.model.findOne({ badgeId: badgeId });
    }

    //update badge unlocks
    //endhoke venam userbadge update akaan
    //incoming will be userId,badgeid,unlocked date
    async unlockBadge(
        badgeId: string,
        userId: string,
    ): Promise<void> {
        await super.create({
            badgeId: new Types.ObjectId(badgeId),
            userId: new Types.ObjectId(userId),
        });
    }
}
