export class BookingEntity {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly mentorId: string,
        public readonly bookingDate: Date,
        public readonly slot: string,
        public readonly status: string,
        public readonly duration: number,
        public readonly topic?: string,
        public readonly rescheduleBy?: 'user' | 'mentor' | null,
        public readonly proposedDate?: Date,
        public readonly proposedSlot?: string,
        public readonly meetingLink?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
