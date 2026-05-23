import { UserStatsEntity } from '@/entity/user-stats.entity';
import { IUserStatsRepository } from './interfaces/IUser-stats.repository';
import { UserStatsMapper } from '@/Mapper/user-stats.mapper';
import { BaseRepository } from '../base.repository';
import { IUserStats, UserStats } from '@/models/userStats.model';

export class UserStatsRepository
    extends BaseRepository<IUserStats>
    implements IUserStatsRepository
{
    constructor() {
        super(UserStats);
    }
    async CreateUserStats(
        data: Partial<UserStatsEntity>
    ): Promise<UserStatsEntity> {
        const UserStatsData = UserStatsMapper.toPersistence(data);
        const stats = await super.create(UserStatsData);
        return UserStatsMapper.toEntity(stats);
    }

    async UpdateUserStats(
        userStatsId: string,
        data: UserStatsEntity
    ): Promise<UserStatsEntity | null> {
        const UserStatsData = UserStatsMapper.toPersistence(data);
        const updated = await super.update(userStatsId, UserStatsData);
        if (!updated) return null;
        return UserStatsMapper.toEntity(updated);
    }

    async FindByUserId(userId: string): Promise<UserStatsEntity | null> {
        const stats = await super.findOne({ userId });
        if (!stats) return null;
        return UserStatsMapper.toEntity(stats);
    }
}
