import {
    BadgeTemplate,
    BadgeType,
    GamificationEvent,
    IconType,
    Rarity,
} from '@/types/gamification.types';

export interface BadgeEntity {
    id: string;
    name: string;
    story: string;
    template: BadgeTemplate;
    type: BadgeType;
    threshold: number;
    design: {
        iconType: IconType;
        iconName?: string;
        imageUrl?: string;
        primaryColor: string;
        bgColor: string;
        rarity: Rarity;
    };
    triggerEvent: GamificationEvent;
    isActive: boolean;
}
