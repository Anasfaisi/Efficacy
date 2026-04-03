import { Types } from 'mongoose';
import { GamificationEvent, IBadge } from '@/types/gamification.types';

export interface IGamificationService {
    evaluateBadges(
        userId: Types.ObjectId,
        event: GamificationEvent
    ): Promise<void>;

    createBadge(badgeData: Partial<IBadge>): Promise<IBadge>;
    getAllBadges(page: number, limit: number): Promise<{ badges: IBadge[], total: number }>;
    getBadgeById(id: string | Types.ObjectId): Promise<IBadge | null>;
    updateBadge(
        id: string | Types.ObjectId,
        updateData: Partial<IBadge>
    ): Promise<IBadge | null>;
    deleteBadge(id: string | Types.ObjectId): Promise<boolean>;
}
