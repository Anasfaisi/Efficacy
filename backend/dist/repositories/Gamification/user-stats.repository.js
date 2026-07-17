"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatsRepository = void 0;
const user_stats_mapper_1 = require("@/Mapper/user-stats.mapper");
const base_repository_1 = require("../base.repository");
const user_stats_model_1 = require("@/models/user-stats.model");
class UserStatsRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_stats_model_1.UserStats);
    }
    async CreateUserStats(data) {
        const UserStatsData = user_stats_mapper_1.UserStatsMapper.toPersistence(data);
        const stats = await super.create(UserStatsData);
        return user_stats_mapper_1.UserStatsMapper.toEntity(stats);
    }
    async UpdateUserStats(userStatsId, data) {
        const UserStatsData = user_stats_mapper_1.UserStatsMapper.toPersistence(data);
        const updated = await super.update(userStatsId, UserStatsData);
        if (!updated)
            return null;
        return user_stats_mapper_1.UserStatsMapper.toEntity(updated);
    }
    async FindByUserId(userId) {
        const stats = await super.findOne({ userId });
        if (!stats)
            return null;
        return user_stats_mapper_1.UserStatsMapper.toEntity(stats);
    }
}
exports.UserStatsRepository = UserStatsRepository;
//# sourceMappingURL=user-stats.repository.js.map