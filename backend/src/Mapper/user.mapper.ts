import { IUser } from "@/models/User.model";
import { UserEntity } from "@/entity/user.entity";
import { Types } from "mongoose";

export class UserMapper {
    static toEntity(doc: IUser): UserEntity {
        const d = doc as any;
        return new UserEntity(
            d._id?.toString() || d.id?.toString(),
            d.name,
            d.email,
            d.role,
            d.bio,
            d.headline,
            d.profilePic,
            d.dob,
            d.stripeCustomerId,
            d.walletBalance,
            d.walletCurrency,
            d.xpPoints,
            d.badge,
            d.league,
            d.currentStreak,
            d.longestStreak,
            d.lastActiveDate,
            d.timezone,
            d.profileCompletion,
            d.isActive,
            d.createdAt,
            d.updatedAt
        );
    }

    static toPersistence(entity: Partial<UserEntity>): any {
        const persistence: any = { ...entity };
        if (entity.id) {
            persistence._id = new Types.ObjectId(entity.id);
            delete persistence.id;
        }
        return persistence;
    }
}
