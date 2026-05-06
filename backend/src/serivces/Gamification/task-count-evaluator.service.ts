import { IBadgeEvaluator } from './interfaces/IBadge-evaluator';
import { BadgeTemplate } from '@/types/gamification.types';
import { BadgeEvaluatorDto } from '@/dto/badge-request.dto';

export class TaskCountEvaluator implements IBadgeEvaluator {
    constructor(public readonly badgeTemplateEvent: BadgeTemplate.TASK_COUNT) {}

    evaulate(data: BadgeEvaluatorDto): boolean {
        return data.userStats.tasksCompleted >= data.badge.threshold;
    }
}
