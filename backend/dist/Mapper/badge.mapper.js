"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeMapper = void 0;
class BadgeMapper {
    static ToResponseDto(badge) {
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
    static ToResponseDtoList(badges) {
        return badges.map(BadgeMapper.ToResponseDto);
    }
    static ToEntity(badge) {
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
    static listtoBadgeEntity(badges) {
        return badges.map(BadgeMapper.ToEntity);
    }
    static toEntityFromCreateReqDto(badge) {
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
    static toEntityFromDto(badge) {
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
    static toPersistence(badgeData) {
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
exports.BadgeMapper = BadgeMapper;
//# sourceMappingURL=badge.mapper.js.map