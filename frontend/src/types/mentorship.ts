export enum MentorshipStatus {
    PENDING = 'pending',
    MENTOR_ACCEPTED = 'mentor_accepted',
    USER_CONFIRMED = 'user_confirmed',
    PAYMENT_PENDING = 'payment_pending',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

export enum SessionStatus {
    PENDING = 'pending',
    BOOKED = 'booked',
    COMPLETED = 'completed',
    RESCHEDULE_REQUESTED = 'reschedule_requested',
    CANCELLED = 'cancelled',
}

export interface ISession {
    _id?: string;
    date: Date | string;
    status: SessionStatus;
    mentorNotes?: string;
    userNotes?: string;
    meetingLink?: string;
}

export interface Mentorship {
    id?: string;
    _id?: string;
    userId: any; // Populated User
    mentorId: any; // Populated Mentor
    status: MentorshipStatus;
    startDate?: Date | string;
    endDate?: Date | string;
    proposedStartDate?: Date | string;
    mentorSuggestedStartDate?: Date | string;

    totalSessions: number;
    usedSessions: number;
    sessions: ISession[];

    paymentStatus: 'pending' | 'paid' | 'verified';
    paymentId?: string;
    amount: number;

    userFeedback?: {
        rating: number;
        comment: string;
    };
    mentorFeedback?: {
        rating: number;
        comment: string;
    };

    userConfirmedCompletion: boolean;
    mentorConfirmedCompletion: boolean;

    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}
