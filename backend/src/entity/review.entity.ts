import { ReviewStatus } from '@/types/review-status.types';

export class ReviewEntity {
    constructor(
        public readonly id?: string,
        public readonly bookingId?: string,
        public readonly mentorId?: string,
        public readonly userId?: string,
        public readonly rating?: number,
        public readonly comment?: string,
        public readonly status?: ReviewStatus,
        public readonly isDeleted?: boolean,
        public readonly reviewWindowOpensAt?: Date,
        public readonly reviewWindowExpiresAt?: Date,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
