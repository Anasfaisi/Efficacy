"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBadgeMapper = void 0;
class UserBadgeMapper {
    static ToEntity(userBadge) {
        return {
            id: userBadge.id,
            userId: userBadge.userId.toString(),
            badgeId: userBadge.badgeId.toString(),
            unlockedAt: userBadge.unlockedAt,
        };
    }
    static listToUserBadgeEntity(badges) {
        return badges.map(UserBadgeMapper.ToEntity);
    }
}
exports.UserBadgeMapper = UserBadgeMapper;
//# sourceMappingURL=user-badge.mapper.js.map