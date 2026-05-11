import { IUserBadge } from '@/models/UserBadge.model';

export interface IUserBadgeRepository {
    findExistingBadge(badgeId: string,userId:string): Promise<IUserBadge | null>;
    unlockBadge(
        badgeId: string,
        userId: string,
    ): Promise<IUserBadge | null>;
}
