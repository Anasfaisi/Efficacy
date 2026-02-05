import { Role } from '@/types/role.types';

export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly role: Role,
        public readonly bio?: string,
        public readonly headline?: string,
        public readonly profilePic?: string,
        public readonly dob?: string,
        public readonly stripeCustomerId?: string,
        public readonly walletBalance?: number,
        public readonly walletCurrency?: string,
        public readonly xpPoints?: number,
        public readonly badge?: string[],
        public readonly league?: string,
        public readonly currentStreak?: number,
        public readonly longestStreak?: number,
        public readonly lastActiveDate?: Date | null,
        public readonly timezone?: string,
        public readonly profileCompletion?: number,
        public readonly isActive?: boolean,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
