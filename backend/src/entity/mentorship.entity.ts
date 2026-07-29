import { MentorshipStatus } from '@/types/mentorship.types';
import { MentorEntity } from './mentor.entity';
import { UserEntity } from './user.entity';
import { PaymentStatus } from '@/types/payment.types';
import { Types } from 'mongoose';
import { SessionStatus } from '@/types/mentorship.types';

export interface SessionEntity {
    id?: string;
    date: Date;
    slot?: string;
    status: SessionStatus;
    mentorNotes?: string;
    userNotes?: string;
    meetingLink?: string;
}

export interface MentorshipEntity {
    id: string;
    userId: Types.ObjectId | UserEntity;
    mentorId: Types.ObjectId | MentorEntity;
    status: MentorshipStatus;
    startDate?: Date;
    endDate?: Date;
    proposedStartDate?: Date;
    totalSessions: number;
    usedSessions: number;
    sessions?: SessionEntity[];
    paymentStatus: PaymentStatus;
    paymentId: string;
    amount: number;
    userConfirmedCompletion: boolean;
    mentorConfirmedCompletion: boolean;
    createdAt: Date;
    updatedAt: Date;
}
