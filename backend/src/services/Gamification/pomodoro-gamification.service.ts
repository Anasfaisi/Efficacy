import { inject, injectable } from 'inversify';
import { IPomodoroGamificationService } from './interfaces/IPomodoro-gamification.service';
import { TYPES } from '@/config/inversify-key.types';
import { IUserStatsRepository } from '@/repositories/Gamification/interfaces/IUser-stats.repository';
import { GamificationEvent } from '@/types/gamification.types';
import { IDailyStreakCalculator } from './interfaces/IDaily-streak-calculator.service';
import { ErrorMessages } from '@/types/response-messages.types';
import { IBadgeGamificationService } from './interfaces/IBadge-gamification.service';
@injectable()
export class PomodoroGamificationService
    implements IPomodoroGamificationService
{
    constructor(
        @inject(TYPES.UserStatsRepository)
        private _userStatsRepo: IUserStatsRepository,
        @inject(TYPES.DailyStreakCalculator)
        private _dailyStreakCalc: IDailyStreakCalculator,
        @inject(TYPES.BadgeGamficationService)
        private _badgeGamificationService: IBadgeGamificationService
    ) {}
    async handlePomodoroCompletion(
        event: GamificationEvent,
        userId: string
    ): Promise<void> {
        let stats = await this._userStatsRepo.FindByUserId(userId);
        if (!stats)
            stats = await this._userStatsRepo.CreateUserStats({
                userId: userId,
                lastActivityDate: new Date(),
            });
        stats.pomodorosCompleted += 1;

        const streakUpdate =
            await this._dailyStreakCalc.calculateDailyStreak(stats);
        const savedStats = await this._userStatsRepo.UpdateUserStats(
            streakUpdate.id,
            streakUpdate
        );
        if (!savedStats) throw new Error(ErrorMessages.UserStatsNotFound);

        await this._badgeGamificationService.evaluate(event, savedStats);
    }
}
