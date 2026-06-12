type IconType = 'icon' | 'image';
export interface Badge {
    id: string;
    name: string;
    story: string;
    template: string;
    threshold: number;
    design: {
        iconType: IconType;
        iconName?: string;
        imageUrl?: string;
        primaryColor: string;
        bgColor: string;
        rarity: keyof typeof Rarity;
    };
    triggerEvent: string;
    isHidden: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    isUnlocked?: boolean;
}

export const BadgeTemplate = {
    TASK_COUNT: 'TASK_COUNT',
    TASK_STREAK: 'TASK_STREAK',
    POMODORO_COUNT: 'POMODORO_COUNT',
    FOCUS_TIME: 'FOCUS_TIME',
    SESSION_COUNT: 'SESSION_COUNT',
};

export const GamificationEvent = {
    TASK_COMPLETED: 'TASK_COMPLETED',
    STREAK_UPDATED: 'STREAK_UPDATED',
    POMODORO_COMPLETED: 'POMODORO_COMPLETED',
    FOCUS_TIME_UPDATED: 'FOCUS_TIME_UPDATED',
    SESSION_COMPLETED: 'SESSION_COMPLETED',
};

export const Rarity = {
    COMMON: 'COMMON',
    UNCOMMON: 'UNCOMMON',
    RARE: 'RARE',
    EPIC: 'EPIC',
    LEGENDARY: 'LEGENDARY',
};

export interface UserBadge {
    userId: string;
    badgeId: string;
    badge: Badge;
    currentStreak: number;
    totalEarned: number;
    unlockedAt: string;
    createdAt: string;
    updatedAt: string;
    isUnlocked?: boolean;
}
