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
exports.BadgeService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const badge_mapper_1 = require("@/Mapper/badge.mapper");
let BadgeService = class BadgeService {
    _badgeRepository;
    _userBadgeRepository;
    constructor(_badgeRepository, _userBadgeRepository) {
        this._badgeRepository = _badgeRepository;
        this._userBadgeRepository = _userBadgeRepository;
    }
    async createBadge(badgeData) {
        const badgeEntity = badge_mapper_1.BadgeMapper.toEntityFromCreateReqDto(badgeData);
        const Badge = await this._badgeRepository.createBadge(badgeEntity);
        return badge_mapper_1.BadgeMapper.ToResponseDto(Badge);
    }
    async getAllBadges(number, limit) {
        const { badges, total } = await this._badgeRepository.getAllBadgesAdmin(number, limit);
        return { badges: badge_mapper_1.BadgeMapper.ToResponseDtoList(badges), total };
    }
    async getBadgeById(badgeId) {
        const badge = await this._badgeRepository.findById(badgeId);
        if (!badge)
            throw new Error('Badge not found');
        return badge_mapper_1.BadgeMapper.ToResponseDto(badge);
    }
    async updateBadge(badgeId, badgeData) {
        const badgeEntity = badge_mapper_1.BadgeMapper.toEntityFromDto(badgeData);
        const result = await this._badgeRepository.update(badgeId, badge_mapper_1.BadgeMapper.toPersistence(badgeEntity));
        if (!result)
            throw new Error('Badge not found');
        return badge_mapper_1.BadgeMapper.ToResponseDto(result);
    }
    async toggleBadgeStatus(badgeId, status) {
        const result = await this._badgeRepository.update(badgeId, {
            isActive: status,
        });
        if (!result)
            throw new Error('Badge not found');
        return badge_mapper_1.BadgeMapper.ToResponseDto(result);
    }
    async getUserBadges(userId) {
        return await this._userBadgeRepository.getAllBadges(userId);
    }
};
exports.BadgeService = BadgeService;
exports.BadgeService = BadgeService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BadgeRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserBadgeRepository)),
    __metadata("design:paramtypes", [Object, Object])
], BadgeService);
//# sourceMappingURL=badge.service.js.map