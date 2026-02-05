import { BookingStatus } from "@/models/Booking.model";

export interface CreateBookingRequestDto {
    userId: string;
    mentorId: string;
    bookingDate: string; // ISO string
    slot: string;
    topic?: string;
}

export interface UpdateBookingStatusRequestDto {
    bookingId: string;
    status: BookingStatus;
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
    userId: string;
    mentorId: string;
    bookingDate: Date;
    slot: string; 
    status: string;
    duration: number;
    topic?: string;
    rescheduleBy?: 'user' | 'mentor' | null;
    proposedDate?: Date;
    proposedSlot?: string;
    meetingLink?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaginatedBookingResponseDto {
    bookings: BookingResponseDto[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
