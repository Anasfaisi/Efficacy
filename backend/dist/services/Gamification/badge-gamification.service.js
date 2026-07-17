"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeGamificationService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const gamification_types_1 = require("@/types/gamification.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let BadgeGamificationService = class BadgeGamificationService {
    _badgeRepository;
    _badgeTemplateResolver;
    _userBadgeRepo;
    _socketService;
    constructor(_badgeRepository, _badgeTemplateResolver, _userBadgeRepo, _socketService) {
        this._badgeRepository = _badgeRepository;
        this._badgeTemplateResolver = _badgeTemplateResolver;
        this._userBadgeRepo = _userBadgeRepo;
        this._socketService = _socketService;
    }
    async evaluate(event, userStats) {
        const possibleBadges = await this._badgeRepository.findBadges({
            triggerEvent: event,
        });
        for (const badge of possibleBadges) {
            // first we need to check the if the user is already having the badge
            // for that now we want to create user badge for checking already occupied
            //we need a badge resolver that would deliver the evaluator
            // 1.construct a badge resolver interface and implementation calling evaluate method
            // 2.evaluate method will accept a badge.template only
            // 3.It should return with an evaluator
            //then we will call the evalutor.evaluate method,
            // it will return boolean
            //if unlocked call badge unlock
            //so nammal badge.id ,userstats.userId ,pass aakunnu,todays date appo calcualte aakunnu aakunnu
            //nnit avar userbadge update aakanm nothing returning ,
            const alreadyEarned = await this._userBadgeRepo.findExistingBadge(badge.id, userStats.userId);
            if (alreadyEarned)
                continue;
            const evaluator = this._badgeTemplateResolver.resolve(badge.template);
            const evaluatedValue = evaluator.evaulate({ userStats, badge });
            if (evaluatedValue)
                await this.unlockBadge(badge, userStats.userId);
        }
    }
    async unlockBadge(badge, userId) {
        //ivde namak vanna userid kk vanna userbadge update aaknm,
        //innatha date calculate aakan , unlocked date kodkaan
        //userbadge repo method ezhudhanm
        //event notifier ne vilikanm
        const alreadyEarned = await this._userBadgeRepo.findExistingBadge(badge.id, userId);
        if (alreadyEarned)
            return;
        const newBadge = await this._userBadgeRepo.unlockBadge(badge.id, userId);
        if (!newBadge) {
            throw new Error(response_messages_types_1.ErrorMessages.BadgeCreationFailed);
        }
        else {
            this._socketService.emitToRoom(userId, gamification_types_1.NotifierEvent.BADGE_UNLOCKED, { badge: badge });
        }
    }
};
exports.BadgeGamificationService = BadgeGamificationService;
exports.BadgeGamificationService = BadgeGamificationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BadgeRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BadgeTemplateResolverService)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserBadgeRepository)),
    __param(3, (0, inversify_1.inject)(inversify_key_types_1.TYPES.SocketService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], BadgeGamificationService);
//# sourceMappingURL=badge-gamification.service.js.map