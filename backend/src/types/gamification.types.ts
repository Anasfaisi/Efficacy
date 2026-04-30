import { Document, Types } from 'mongoose';

export enum BadgeTemplate {
    TASK_COUNT = 'TASK_COUNT',
    TASK_STREAK = 'TASK_STREAK',
    POMODORO_COUNT = 'POMODORO_COUNT',
    FOCUS_TIME = 'FOCUS_TIME',
    SESSION_COUNT = 'SESSION_COUNT',
}

export enum GamificationEvent {
    TASK_COMPLETED = 'TASK_COMPLETED',
    STREAK_UPDATED = 'STREAK_UPDATED',
    POMODORO_COMPLETED = 'POMODORO_COMPLETED',
    FOCUS_TIME_UPDATED = 'FOCUS_TIME_UPDATED',
    SESSION_COMPLETED = 'SESSION_COMPLETED',
}

export enum Rarity{
    COMMON = 'COMMON',
    UNCOMMON = 'UNCOMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY',
}
export enum IconType{
    ICON='icon',
    IMAGE='image'
}

export interface GamificationEventPayload {
    userId: string;
    [key: string]: any;
}




export interface IUserBadge extends Document {
    userId: Types.ObjectId;
    badgeId: Types.ObjectId;
    unlockedAt: Date;
    seen: boolean;
}
