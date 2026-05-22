import { BadgeEntity } from '@/entity/badge.entity';
import { UserStatsEntity } from '@/entity/user-stats.entity';
import {
    BadgeTemplate,
    GamificationEvent,
    IconType,
    Rarity,
} from '@/types/gamification.types';

export interface CreateBadgeRequestDto {
    name: string;
    story: string;
    template: BadgeTemplate;
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
    createdBy: string;
}

export interface BadgeEvaluatorDto {
    userStats: UserStatsEntity;
    badge: BadgeEntity;
}
