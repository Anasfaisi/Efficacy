"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toEntity(doc) {
        return {
            id: doc.id,
            name: doc.name,
            email: doc.email,
            role: doc.role,
            bio: doc.bio,
            headline: doc.headline,
            profilePic: doc.profilePic,
            dob: doc.dob,
            stripeCustomerId: doc.stripeCustomerId,
            walletBalance: doc.walletBalance,
            walletCurrency: doc.walletCurrency,
            xpPoints: doc.xpPoints,
            badge: doc.badge,
            league: doc.league,
            currentStreak: doc.currentStreak,
            longestStreak: doc.longestStreak,
            lastActiveDate: doc.lastActiveDate,
            timezone: doc.timezone,
            profileCompletion: doc.profileCompletion,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
    static toPersistence(entity) {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            role: entity.role,
            bio: entity.bio,
            headline: entity.headline,
            profilePic: entity.profilePic,
            dob: entity.dob,
            stripeCustomerId: entity.stripeCustomerId,
            walletBalance: entity.walletBalance,
            walletCurrency: entity.walletCurrency,
            xpPoints: entity.xpPoints,
            badge: entity.badge,
            league: entity.league,
            currentStreak: entity.currentStreak,
            longestStreak: entity.longestStreak,
            lastActiveDate: entity.lastActiveDate,
            timezone: entity.timezone,
            profileCompletion: entity.profileCompletion,
            isActive: entity.isActive,
        };
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=user.mapper.js.map