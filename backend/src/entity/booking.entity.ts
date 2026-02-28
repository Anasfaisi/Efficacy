import { UserEntity } from './user.entity';
import { MentorEntity } from './mentor.entity';

export class BookingEntity {
    constructor(
        public id: string,
        public userId: string | UserEntity,
        public mentorId: string | MentorEntity,
        public bookingDate: Date,
        public slot: string,
        public status: string,
        public duration: number,
        public topic?: string,
        public rescheduleBy?: 'user' | 'mentor' | null,
        public proposedDate?: Date,
        public proposedSlot?: string,
        public meetingLink?: string,
        public cancelReason?: string,
        public actualStartTime?: Date,
        public actualEndTime?: Date,
        public sessionMinutes?: number,
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}
}
