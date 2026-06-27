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
