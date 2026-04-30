import { Types } from 'mongoose';
import { GamificationEvent} from '@/types/gamification.types';

export interface IGamificationService {
    evaluateBadges(
        userId: Types.ObjectId,
        event: GamificationEvent
    ): Promise<void>;

}
