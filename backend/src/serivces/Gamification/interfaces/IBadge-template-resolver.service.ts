import { BadgeTemplate } from '@/types/gamification.types';
import { IBadgeEvaluator } from './IBadge-evaluator';

export interface IBadgeTemplateResolverService {
    resolve(templateEvent: BadgeTemplate): IBadgeEvaluator;
}
