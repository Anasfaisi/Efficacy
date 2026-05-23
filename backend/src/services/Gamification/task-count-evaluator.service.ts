import { IBadgeEvaluator } from './interfaces/IBadge-evaluator';
import { BadgeTemplate } from '@/types/gamification.types';
import { BadgeEvaluatorDto } from '@/dto/badge-request.dto';
import { injectable } from 'inversify';

@injectable()
export class TaskCountEvaluator implements IBadgeEvaluator {
    public readonly badgeTemplateEvent: BadgeTemplate =
        BadgeTemplate.TASK_COUNT;
    constructor() {}

    evaulate(data: BadgeEvaluatorDto): boolean {
        return data.userStats.tasksCompleted >= data.badge.threshold;
    }
}
