import { BadgeTemplate } from '@/types/gamification.types';
import { IBadgeEvaluator } from './interfaces/IBadge-evaluator';
import { BadgeEvaluatorDto } from '@/dto/badge-request.dto';

export class PomodoroEvaluator implements IBadgeEvaluator {
    public readonly badgeTemplateEvent: BadgeTemplate.POMODORO_COUNT
    constructor(
    ) {}
    evaulate(data: BadgeEvaluatorDto): boolean {
        return data.userStats.pomodorosCompleted >= data.badge.threshold;
    }
}
