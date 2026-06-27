import {
    BadgeRequestDto,
    CreateBadgeRequestDto,
} from '@/dto/badge-request.dto';
import { CreateBadgeResponseDto } from '@/dto/badge-response.dto';
import { BadgeEntity } from '@/entity/badge.entity';
import { IBadge } from '@/models/badge.model';

export class BadgeMapper {
    static ToResponseDto(badge: BadgeEntity): CreateBadgeResponseDto {
        return {
            id: badge.id,
            name: badge.name,
            story: badge.story,
            template: badge.template,
            type: badge.type,
            threshold: badge.threshold,
            design: badge.design,
            triggerEvent: badge.triggerEvent,
            isActive: badge.isActive,
        };
    }

    static ToResponseDtoList(badges: IBadge[]): CreateBadgeResponseDto[] {
        return badges.map(BadgeMapper.ToResponseDto);
    }

    static ToEntity(badge: IBadge): BadgeEntity {
        return {
            id: badge.id,
            name: badge.name,
            story: badge.story,
            template: badge.template,
            type: badge.type,
            threshold: badge.threshold,
            design: {
                iconType: badge.design.iconType,
                iconName: badge.design.iconName,
                imageUrl: badge.design.imageUrl,
                primaryColor: badge.design.primaryColor,
                bgColor: badge.design.bgColor,
                rarity: badge.design.rarity,
            },
            triggerEvent: badge.triggerEvent,
            isActive: badge.isActive,
        };
    }

    static listtoBadgeEntity(badges: IBadge[]) {
        return badges.map(BadgeMapper.ToEntity);
    }

    static toEntityFromCreateReqDto(
        badge: CreateBadgeRequestDto
    ): Partial<BadgeEntity> {
        return {
            name: badge.name,
            story: badge.story,
            template: badge.template,
            type: badge.type,
            threshold: badge.threshold,
            design: {
                iconType: badge.design.iconType,
                iconName: badge.design.iconName,
                imageUrl: badge.design.imageUrl,
                primaryColor: badge.design.primaryColor,
                bgColor: badge.design.bgColor,
                rarity: badge.design.rarity,
            },
            triggerEvent: badge.triggerEvent,
            isActive: badge.isActive,
        };
    }
    static toEntityFromDto(badge: BadgeRequestDto): BadgeEntity {
        return {
            id: badge.id,
            name: badge.name,
            story: badge.story,
            template: badge.template,
            type: badge.type,
            threshold: badge.threshold,
            design: {
                iconType: badge.design.iconType,
                iconName: badge.design.iconName,
                imageUrl: badge.design.imageUrl,
                primaryColor: badge.design.primaryColor,
                bgColor: badge.design.bgColor,
                rarity: badge.design.rarity,
            },
            triggerEvent: badge.triggerEvent,
            isActive: badge.isActive,
        };
    }

    static toPersistence(badgeData: BadgeEntity): Partial<IBadge> {
        return {
            id: badgeData.id,
            name: badgeData.name,
            story: badgeData.story,
            type: badgeData.type,
            template: badgeData.template,
            threshold: badgeData.threshold,
            design: badgeData.design,
            triggerEvent: badgeData.triggerEvent,
            isActive: badgeData.isActive,
        };
    }
}
