import { BookingEntity } from '@/entity/booking.entity';

export interface IBookingRepository {
    create(booking: BookingEntity): Promise<BookingEntity>;
    findById(id: string): Promise<BookingEntity | null>;
    findByUser(
        userId: string,
        page: number,
        limit: number
    ): Promise<BookingEntity[]>;
    findByMentor(mentorId: string): Promise<BookingEntity[]>;
    update(
        id: string,
        booking: Partial<BookingEntity>
    ): Promise<BookingEntity | null>;
    hasExistingBooking(userId: string, date: Date): Promise<boolean>;
    isSlotAvailable(
        mentorId: string,
        date: Date,
        slot: string,
        excludeBookingId?: string
    ): Promise<boolean>;
    countBookingsInDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<number>;
    findPaginatedByUser(
        userId: string,
        page: number,
        limit: number,
        status?: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ bookings: BookingEntity[]; total: number }>;
    findPaginatedByMentor(
        mentorId: string,
        page: number,
        limit: number,
        status?: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ bookings: BookingEntity[]; total: number }>;
}
