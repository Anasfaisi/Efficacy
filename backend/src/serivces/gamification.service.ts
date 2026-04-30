import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { Types } from 'mongoose';
import { Badge,IBadge} from '@/models/Badge.model';
import { UserStats } from '@/models/UserStats.model';
import { UserBadge } from '@/models/UserBadge.model';
import { badgeTemplates } from '@/config/badgeTemplates.config';
import { ISocketService } from './Interfaces/ISocket.service';
import {
    GamificationEvent,
    BadgeTemplate,
} from '@/types/gamification.types';
import { IGamificationService } from './Interfaces/IGamification.service';
import { IBadgeRepository } from '@/repositories/interfaces/IBadge.repository';
import { subscribeToGamificationEvent, emitGamificationEvent } from '@/utils/eventBus';
import { logger } from '@/utils/logMiddlewares';
import { IUserStatsRepository } from '@/repositories/Gamification/interfaces/IUser-stats.repository';
import { IDailyStreakCalculator } from './Gamification/interfaces/IDaily-streak-calculator.service';

@injectable()
export class GamificationService implements IGamificationService {
    constructor(
        @inject(TYPES.SocketService) private _socketService: ISocketService,
        @inject(TYPES.BadgeRepository) private _badgeRepository: IBadgeRepository,
        @inject(TYPES.UserStatsRepository) private _userStatsRepository: IUserStatsRepository,
        @inject(TYPES.DailyStreakCalculator) private _dailyStreakCalculator: IDailyStreakCalculator
    ) {
        this.initializeListeners();
    }

    private initializeListeners() {
        
        const events = Object.values(GamificationEvent);
        for (const event of events) {
            subscribeToGamificationEvent(
                event as GamificationEvent,
                async (payload) => {
                    try {
                        const userIdStr = payload.userId.toString();

                        if (event === GamificationEvent.TASK_COMPLETED) {
                            let stats = await this._userStatsRepository.FindByUserId(userIdStr);
                            if (!stats) {
                                stats = await this._userStatsRepository.CreateUserStats({
                                    id: new Types.ObjectId().toString(),
                                    userId: userIdStr,
                                    taskStreakDays: 0,
                                    tasksCompleted: 0,
                                    pomodorosCompleted: 0,
                                    focusMinutes: 0,
                                    sessionsCompleted: 0,
                                    lastActivityDate: new Date()
                                });
                            }

                            const oldStreak = stats.taskStreakDays;
                            stats.tasksCompleted += 1;
                            
                            stats = await this._dailyStreakCalculator.calculateDailyStreak(stats);
                            await this._userStatsRepository.UpdateUserStats(stats.id, stats);
                            
                            if (stats.taskStreakDays !== oldStreak) {
                                emitGamificationEvent(GamificationEvent.STREAK_UPDATED, { userId: payload.userId });
                            }
                        }

                        await this.evaluateBadges(
                            new Types.ObjectId(payload.userId),
                            event as GamificationEvent
                        );
                    } catch (error) {
                        logger.error(
                            `Error during Gamification evaluation for ${payload.userId} on ${event}:`,
                            error
                        );
                    }
                }
            );
        }
        logger.info(
            '🎮 Gamification Service initialized and listening to events.'
        );
    }

    public async evaluateBadges(
        userId: Types.ObjectId,
        event: GamificationEvent
    ) {
        try {
            const userStats = await UserStats.findOne({ userId });
            if (!userStats) return;

            const eligibleBadges = await Badge.find({
                triggerEvent: event,
                isActive: true,
            });

            if (eligibleBadges.length === 0) return;

            const unlockedBadges = await UserBadge.find({ userId }).select(
                'badgeId'
            );
            const unlockedBadgeIds = unlockedBadges.map((ub) =>
                (ub.badgeId as Types.ObjectId).toString()
            );

            const badgesToEvaluate = eligibleBadges.filter(
                (badge) =>
                    !unlockedBadgeIds.includes(
                        (badge._id as Types.ObjectId).toString()
                    )
            );

            for (const badge of badgesToEvaluate) {
                const config = badgeTemplates[badge.template as BadgeTemplate];
                if (!config) continue;
                const metricValue = (userStats as any)[config.metric];

                if (metricValue === undefined || metricValue === null) continue;

                let conditionMet = false;
                if (config.operator === '>=') {
                    conditionMet = metricValue >= badge.threshold;
                } else if (config.operator === '==') {
                    conditionMet = metricValue == badge.threshold;
                }

                if (conditionMet) {
                    await this.unlockBadge(userId, badge._id as Types.ObjectId);
                }
            }
        } catch (error) {
            logger.error(
                `Error evaluating badges for user ${userId} and event ${event}:`,
                error
            );
        }
    }

    private async unlockBadge(userId: Types.ObjectId, badgeId: Types.ObjectId) {
        try {
            const existing = await UserBadge.findOne({ userId, badgeId });
            if (existing) return;

            logger.info(`Unlocking badge ${badgeId} for user ${userId}`);

            await UserBadge.create({
                userId,
                badgeId,
                unlockedAt: new Date(),
                seen: false,
            });

            const badgeDetails = await Badge.findById(badgeId).lean();

        this._socketService.emitToRoom(
                userId.toString(),
                'BADGE_UNLOCKED',
                { badge: badgeDetails }
            );
        } catch (error: any) {
            if (error.code === 11000) {
                logger.warn(
                    `Gamification: Badge ${badgeId} skipped for ${userId} (Already unlocked natively).`
                );
            } else {
                logger.error(
                    `Error unlocking badge ${badgeId} for user ${userId}:`,
                    error
                );
            }
        }
    }
}