import { BadgeEvaluatorDto } from '@/dto/badge-request.dto';

export interface IBadgeEvaluator {
    readonly badgeTemplateEvent: string;
    evaulate(data: BadgeEvaluatorDto): boolean;
}
