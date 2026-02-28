import { BookingStatus } from '@/types/booking-status.types';

export interface CreateBookingRequestDto {
    userId: string;
    mentorId: string;
    bookingDate: string;
    slot: string;
    topic?: string;
}

export interface UpdateBookingStatusRequestDto {
    bookingId: string;
    status: BookingStatus;
    cancelReason?: string;
    rescheduleDetails?: {
        proposedDate?: string;
        proposedSlot?: string;
    };
}

export interface RescheduleRequestDto {
    bookingId: string;
    proposedDate: string;
    proposedSlot: string;
    requestedBy: 'user' | 'mentor';
}

export interface BookingResponseDto {
    id: string;
    userId: string | object;
    mentorId: string | object;
    bookingDate: Date;
    slot: string;
    status: string;
    duration: number;
    topic?: string;
    rescheduleBy?: 'user' | 'mentor' | null;
    proposedDate?: Date;
    proposedSlot?: string;
    meetingLink?: string;
    cancelReason?: string;
    actualStartTime?: Date;
    actualEndTime?: Date;
    sessionMinutes?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaginatedBookingResponseDto {
    bookings: BookingResponseDto[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
