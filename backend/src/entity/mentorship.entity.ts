import { MentorshipStatus } from '@/types/mentorship.types';
import { MentorEntity } from './mentor.entity';
import { UserEntity } from './user.entity';
import { PaymentStatus } from '@/types/payment.types';
import { ObjectId } from 'mongoose';

export interface MentorshipEntity {
    id: string;
    userId: ObjectId | UserEntity;
    mentorId: ObjectId | MentorEntity;
    status: MentorshipStatus;
    startDate?: Date;
    endDate?: Date;
    proposedStartDate?: Date;
    totalSessions: number;
    usedSessions: number;
    paymentStatus: PaymentStatus;
    paymentId: string;
    amount: number;
    userConfirmedCompletion: boolean;
    mentorConfirmedCompletion: boolean;
    createdAt: Date;
    updatedAt: Date;
}
