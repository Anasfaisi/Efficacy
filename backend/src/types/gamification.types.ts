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

export interface GamificationEventPayload {
    userId: string;
    [key: string]: any;
}

export interface IBadge extends Document {
    name: string;
    story: string;
    template: BadgeTemplate;
    threshold: number;
    design: {
        iconType: 'icon' | 'image';
        iconName?: string;
        imageUrl?: string;
        primaryColor: string;
        bgColor: string;
        rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    };
    triggerEvent: GamificationEvent;
    isHidden: boolean;
    isActive: boolean;
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserStats extends Document {
    userId: Types.ObjectId;
    tasksCompleted: number;
    taskStreakDays: number;
    pomodorosCompleted: number;
    focusMinutes: number;
    sessionsCompleted: number;
    lastActivityDate: Date;
    updatedAt: Date;
}

export interface IUserBadge extends Document {
    userId: Types.ObjectId;
    badgeId: Types.ObjectId;
    unlockedAt: Date;
    seen: boolean;
}
