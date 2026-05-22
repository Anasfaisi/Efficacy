import { IUserBadge, UserBadge } from '@/models/UserBadge.model';
import { BaseRepository } from '../base.repository';
import { IUserBadgeRepository } from './interfaces/IUser-badge.repository';
import { Types } from 'mongoose';
import { UserBadgeMapper } from '@/Mapper/user-badge.mapper';
import { UserBadgeEntity } from '@/entity/user-badge.entity';

export class UserBadgeRepository
    extends BaseRepository<IUserBadge>
    implements IUserBadgeRepository
{
    constructor() {
        super(UserBadge);
    }
    async findExistingBadge(
        badgeId: string,
        userId: string
    ): Promise<IUserBadge | null> {
        return this.model.findOne({ badgeId: badgeId, userId: userId });
    }

    //update badge unlocks
    //endhoke venam userbadge update akaan
    //incoming will be userId,badgeid,unlocked date
    async unlockBadge(
        badgeId: string,
        userId: string
    ): Promise<IUserBadge | null> {
        return await super.create({
            badgeId: new Types.ObjectId(badgeId),
            userId: new Types.ObjectId(userId),
        });
    }

    async getAllBadges(userId: string): Promise<UserBadgeEntity[]> {
        const result = await super.find({ userId: userId });
        return UserBadgeMapper.listToUserBadgeEntity(result);
    }
}
