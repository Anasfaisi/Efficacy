import { CreateBadgeRequestDto } from '@/Dto/badge-request.dto';
import { CreateBadgeResponseDto } from '@/Dto/badge-response.dto';
import { IBadgeService } from './interfaces/IBadge.service';
import { inject, injectable } from 'inversify';
import { IBadgeRepository } from '@/repositories/interfaces/IBadge.repository';
import { TYPES } from '@/config/inversify-key.types';
import { BadgeMapper } from '@/Mapper/badge.mapper';
import { IBadge } from '@/models/Badge.model';

@injectable()
export class BadgeService implements IBadgeService {
    constructor(
        @inject(TYPES.BadgeRepository)
        private _badgeRepository: IBadgeRepository
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
    ): Promise<{ badges: IBadge[]; total: number }> {
        return await this._badgeRepository.getAllBadgesAdmin(number, limit);
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
    async toggleBadgeStatus(badgeId: string, status: string): Promise<void> {
        return await this._badgeRepository.updateOne(badgeId, {isActive:status});
    }

}
