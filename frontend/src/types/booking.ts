export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    RESCHEDULED = 'rescheduled',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

export interface Booking {
    id: string;
    userId: string;
    mentorId: string;
    bookingDate: string; 
    slot: string; 
    status: BookingStatus;
    duration: number;
    topic?: string;
    rescheduleBy?: 'user' | 'mentor' | null;
    proposedDate?: string;
    proposedSlot?: string; 
    meetingLink?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookingRequestDto {
    mentorId: string;
    bookingDate: string;
    slot: string; 
    topic: string;
}

export interface UpdateBookingStatusRequestDto {
    bookingId: string;
    status: BookingStatus;
}

export interface RescheduleRequestDto {
    bookingId: string;
    proposedDate: string;
    proposedSlot: string; // Specific hourly slot e.g., "10:00 AM - 11:00 AM"
}
