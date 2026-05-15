import { GamificationEvent } from '@/types/gamification.types';
import { ITaskGamificationHandleService } from './interfaces/ITask-Gamification-handle.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IUserStatsRepository } from '@/repositories/Gamification/interfaces/IUser-stats.repository';
import { IDailyStreakCalculator } from './interfaces/IDaily-streak-calculator.service';
import { ErrorMessages } from '@/types/response-messages.types';
import { IBadgeGamificationService } from './interfaces/IBadge-gamification.service';
@injectable()
export class TaskGamificationHandleService
    implements ITaskGamificationHandleService
{
    
    constructor(
        @inject(TYPES.UserStatsRepository)
        private _userStatsRepo: IUserStatsRepository,
        @inject(TYPES.DailyStreakCalculator)
        private _dailyStreakCalculator: IDailyStreakCalculator,
        @inject(TYPES.BadgeGamficationService) 
        private _badgeGamficationService: IBadgeGamificationService,
    ) {}

    async processAction(
        event: GamificationEvent,
        userId: string
    ): Promise<void> {
        let stats = await this._userStatsRepo.FindByUserId(userId);
        if (!stats)
            stats = await this._userStatsRepo.CreateUserStats({
                userId: userId,
                lastActivityDate: new Date(),
            });
        stats.tasksCompleted += 1;

        const updatedStats =
            await this._dailyStreakCalculator.calculateDailyStreak(stats);

        const savedStats = await this._userStatsRepo.UpdateUserStats(
            updatedStats.id,
            updatedStats
        );
        if (!savedStats) throw new Error(ErrorMessages.UserStatsNotFound);
 
        await this._badgeGamficationService.evaluate(event,savedStats)
        
    }
}
