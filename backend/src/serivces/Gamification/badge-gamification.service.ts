import { UserStatsEntity } from '@/entity/user-stats.entity';
import { IBadgeGamificationService } from './interfaces/IBadge-gamification.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { GamificationEvent } from '@/types/gamification.types';
import { IBadgeRepository } from '@/repositories/interfaces/IBadge.repository';
import { IBadgeTemplateResolverService } from './interfaces/IBadge-template-resolver.service';

@injectable()
export class BadgeGamificationService implements IBadgeGamificationService {
    constructor(
        @inject(TYPES.BadgeRepository)
        private _badgeRepository: IBadgeRepository,
        @inject(TYPES.BadgeTemplateResolverService) private _badgeTemplateResolver : IBadgeTemplateResolverService,
        @inject(TYPES.)
    ) {}
    async evaluate(
        event: GamificationEvent,
        userstats: UserStatsEntity
    ): Promise<void> {
        const possibleBadges = await this._badgeRepository.findBadges({
            triggerEvent: event,
        });

        for (let badge of possibleBadges) {
            // first we need to check the if the user is already having the badge
            // for that now we want to create 
            const alreadyEarned = 
            //we need a badge resolver that would deliver the evaluator
            const evaluator = this._badgeTemplateResolver(badge.template)
            // with badge.template (TASk_COUNT)
            // 1.construct a badge resolver interface and implementation calling evaluate method
            // 2.evaluate method will accept a badge.template only
            // 3.It should return with an evaluator
            //then we will call the evalutor.evaluate method,
            // it will return boolean
            //if unlocked call badge unlock
        }
    }
}
