import mongoose, { Schema } from 'mongoose';
import { IUserBadge } from '../types/gamification.types';

const UserBadgeSchema = new Schema<IUserBadge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
    unlockedAt: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false }
  }
);

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const UserBadge = mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);
