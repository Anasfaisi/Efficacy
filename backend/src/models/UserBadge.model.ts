import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserBadge extends Document {
    userId: Types.ObjectId;
    badgeId: Types.ObjectId;
    unlockedAt: Date;
    seen: boolean;
}


const UserBadgeSchema = new Schema<IUserBadge>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
    unlockedAt: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false },
});

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const UserBadge = mongoose.model<IUserBadge>(
    'UserBadge',
    UserBadgeSchema
);
