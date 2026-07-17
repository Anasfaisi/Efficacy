"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBadgeRepository = void 0;
const user_badge_model_1 = require("@/models/user-badge.model");
const base_repository_1 = require("../base.repository");
const mongoose_1 = require("mongoose");
const user_badge_mapper_1 = require("@/Mapper/user-badge.mapper");
class UserBadgeRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_badge_model_1.UserBadge);
    }
    async findExistingBadge(badgeId, userId) {
        return this.model.findOne({ badgeId: badgeId, userId: userId });
    }
    //update badge unlocks
    //endhoke venam userbadge update akaan
    //incoming will be userId,badgeid,unlocked date
    async unlockBadge(badgeId, userId) {
        return await super.create({
            badgeId: new mongoose_1.Types.ObjectId(badgeId),
            userId: new mongoose_1.Types.ObjectId(userId),
        });
    }
    async getAllBadges(userId) {
        const result = await super.find({ userId: userId });
        return user_badge_mapper_1.UserBadgeMapper.listToUserBadgeEntity(result);
    }
}
exports.UserBadgeRepository = UserBadgeRepository;
//# sourceMappingURL=user-badge.repository.js.map