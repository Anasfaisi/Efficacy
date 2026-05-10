import { UserStatsEntity } from '@/entity/user-stats.entity';
import { IBadgeGamificationService } from './interfaces/IBadge-gamification.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { GamificationEvent, NotifierEvent } from '@/types/gamification.types';
import { IBadgeRepository } from '@/repositories/interfaces/IBadge.repository';
import { IBadgeTemplateResolverService } from './interfaces/IBadge-template-resolver.service';
import { IUserBadgeRepository } from '@/repositories/Gamification/interfaces/IUser-badge.repository';
import { ISocketService } from '../Interfaces/ISocket.service';
import { BadgeEntity } from '@/entity/badge.entity';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class BadgeGamificationService implements IBadgeGamificationService {
    constructor(
        @inject(TYPES.BadgeRepository)
        private _badgeRepository: IBadgeRepository,
        @inject(TYPES.BadgeTemplateResolverService) private _badgeTemplateResolver : IBadgeTemplateResolverService,
        @inject(TYPES.UserBadgeRepository) private _userBadgeRepo : IUserBadgeRepository,
        @inject(TYPES.SocketService) private _socketService : ISocketService
    ) {}
    async evaluate(
        event: GamificationEvent,
        userStats: UserStatsEntity
    ): Promise<void> {
        const possibleBadges = await this._badgeRepository.findBadges({
            triggerEvent: event,
        });

        for (const badge of possibleBadges) {
            // first we need to check the if the user is already having the badge
            // for that now we want to create user badge for checking already occupied
            const alreadyEarned = await this._userBadgeRepo.findExistingBadge(badge.id)
            if(alreadyEarned)continue

            //we need a badge resolver that would deliver the evaluator
            const evaluator = this._badgeTemplateResolver.resolve(badge.template)

            // 1.construct a badge resolver interface and implementation calling evaluate method
            // 2.evaluate method will accept a badge.template only
            // 3.It should return with an evaluator

            //then we will call the evalutor.evaluate method,
            // it will return boolean
            const evaluatedValue = evaluator.evaulate({userStats,badge})

            //if unlocked call badge unlock
            if(evaluatedValue) await this.unlockBadge(badge,userStats.userId)
            //so nammal badge.id ,userstats.userId ,pass aakunnu,todays date appo calcualte aakunnu aakunnu
            //nnit avar userbadge update aakanm nothing returning ,
        }
    }

    private async unlockBadge(badge:BadgeEntity,userId:string): Promise<void> {
        //ivde namak vanna userid kk vanna userbadge update aaknm,
        //innatha date calculate aakan , unlocked date kodkaan
                    const alreadyEarned = await this._userBadgeRepo.findExistingBadge(badge.id)
         if(!alreadyEarned) return 
          const newBadge =  await this._userBadgeRepo.unlockBadge(badge.id,userId)

          if(!newBadge) {throw new Error( ErrorMessages.BadgeCreationFailed)}else{
              await this._socketService.emitToRoom(userId,NotifierEvent.BADGE_UNLOCKED,{badge:badge})
          }

        //userbadge repo method ezhudhanm
        //event notifier ne vilikanm
    }
}
