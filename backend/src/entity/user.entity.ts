import { Role } from '@/types/role.types';

export interface UserEntity {
    id: string;
    name: string;
    email: string;
    role: Role;
    bio?: string;
    headline?: string;
    profilePic?: string;
    dob?: string;
    stripeCustomerId?: string;
    walletBalance?: number;
    walletCurrency?: string;
    xpPoints?: number;
    badge?: string;
    league?: string;
    currentStreak?: number;
    longestStreak?: number;
    lastActiveDate?: Date | null;
    timezone?: string;
    profileCompletion?: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
