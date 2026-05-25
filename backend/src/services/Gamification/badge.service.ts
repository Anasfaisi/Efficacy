import { CreateBadgeRequestDto } from '@/dto/badge-request.dto';
import { CreateBadgeResponseDto } from '@/dto/badge-response.dto';
import { IBadgeService } from './interfaces/IBadge.service';
import { inject, injectable } from 'inversify';
import { IBadgeRepository } from '@/repositories/interfaces/IBadge.repository';
import { TYPES } from '@/config/inversify-key.types';
import { BadgeMapper } from '@/Mapper/badge.mapper';
import { UserBadgeEntity } from '@/entity/user-badge.entity';
import { IUserBadgeRepository } from '@/repositories/Gamification/interfaces/IUser-badge.repository';

@injectable()
export class BadgeService implements IBadgeService {
    constructor(
        @inject(TYPES.BadgeRepository)
        private _badgeRepository: IBadgeRepository,
        @inject(TYPES.UserBadgeRepository)
        private _userBadgeRepository: IUserBadgeRepository
    ) {}
    async createBadge(
        badgeData: CreateBadgeRequestDto
    ): Promise<CreateBadgeResponseDto> {
        //needed a mapped badge to give to badge repo
        const Badge = await this._badgeRepository.create(badgeData as any);
        return BadgeMapper.ToResponseDto(Badge);
    }

    async getAllBadges(
        number: number,
        limit: number
    ): Promise<{ badges: CreateBadgeResponseDto[]; total: number }> {
        const { badges, total } = await this._badgeRepository.getAllBadgesAdmin(
            number,
            limit
        );
        return { badges: BadgeMapper.ToResponseDtoList(badges), total };
    }

    async getBadgeById(badgeId: string): Promise<CreateBadgeResponseDto> {
        const badge = await this._badgeRepository.findById(badgeId);
        if (!badge) throw new Error('Badge not found');
        return BadgeMapper.ToResponseDto(badge);
    }

    async updateBadge(
        badgeId: string,
        badgeData: CreateBadgeRequestDto
    ): Promise<CreateBadgeResponseDto> {
        const result = await this._badgeRepository.update(
            badgeId,
            badgeData as any
        );
        if (!result) throw new Error('Badge not found');
        return BadgeMapper.ToResponseDto(result);
    }
    async toggleBadgeStatus(
        badgeId: string,
        status: boolean
    ): Promise<CreateBadgeResponseDto> {
        const result = await this._badgeRepository.update(badgeId, {
            isActive: status,
        });
        if (!result) throw new Error('Badge not found');
        return BadgeMapper.ToResponseDto(result);
    }

    async getUserBadges(userId: string): Promise<UserBadgeEntity[]> {
        return await this._userBadgeRepository.getAllBadges(userId);
    }
}
