import { UserBadgeEntity } from '@/entity/user-badge.entity';
import { IUserBadge } from '@/models/userBadge.model';

export class UserBadgeMapper {
    static ToEntity(userBadge: IUserBadge): UserBadgeEntity {
        return {
            id: userBadge.id,
            userId: userBadge.userId.toString(),
            badgeId: userBadge.badgeId.toString(),
            unlockedAt: userBadge.unlockedAt,
        };
    }
    static listToUserBadgeEntity(badges: IUserBadge[]): UserBadgeEntity[] {
        return badges.map(UserBadgeMapper.ToEntity);
    }
}
