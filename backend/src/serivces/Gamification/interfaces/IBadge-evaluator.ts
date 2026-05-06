import { BadgeEvaluatorDto } from '@/dto/badge-request.dto';
import { GamificationEvent } from '@/types/gamification.types';

export interface IBadgeEvaluator{
    readonly badgeTemplateEvent: string;
    evaulate(data: BadgeEvaluatorDto): boolean;
}
