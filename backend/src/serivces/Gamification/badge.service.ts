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
        @inject(TYPES.UserBadgeRepository) private _userBadgeRepository : IUserBadgeRepository
    ) {}
    async createBadge(
        badgeData: CreateBadgeRequestDto
    ): Promise<CreateBadgeResponseDto> {
        const Badge = await this._badgeRepository.create(badgeData);
        return BadgeMapper.ToResponseDto(Badge);
    }

    async getAllBadges(
        number: number,
        limit: number
    ): Promise<{ badges: CreateBadgeResponseDto[]; total: number }> {
        const { badges, total } = await this._badgeRepository.getAllBadgesAdmin(number, limit);
        return { badges: BadgeMapper.ToResponseDtoList(badges), total };
    }

    async getBadgeById(badgeId: string): Promise<CreateBadgeResponseDto> {
        return await this._badgeRepository.findById(badgeId);
    }

    async updateBadge(
        badgeId: string,
        badgeData: CreateBadgeRequestDto
    ): Promise<CreateBadgeResponseDto> {
        return await this._badgeRepository.update(badgeId, badgeData);
    }
    async toggleBadgeStatus(badgeId: string, status: boolean): Promise<CreateBadgeResponseDto> {
        const result =  await this._badgeRepository.update(badgeId, {isActive:status});
        return BadgeMapper.ToResponseDto(result);
    }

    async getUserBadges(userId:string):Promise<UserBadgeEntity[]>{
        return await this._userBadgeRepository.getAllBadges(userId)
    }

}
