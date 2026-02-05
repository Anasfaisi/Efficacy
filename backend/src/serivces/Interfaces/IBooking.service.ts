import { CreateBookingRequestDto, BookingResponseDto, UpdateBookingStatusRequestDto, RescheduleRequestDto, PaginatedBookingResponseDto } from "@/Dto/booking.dto";

export interface IBookingService {
    createBooking(data: CreateBookingRequestDto): Promise<BookingResponseDto>;
    getBookingById(id: string): Promise<BookingResponseDto | null>;
    getUserBookings(userId: string): Promise<BookingResponseDto[]>;
    getMentorBookings(
        mentorId: string,
        page?: number,
        limit?: number,
        status?: string
    ): Promise<PaginatedBookingResponseDto>;
    updateBookingStatus(data: UpdateBookingStatusRequestDto): Promise<BookingResponseDto>;
    requestReschedule(data: RescheduleRequestDto): Promise<BookingResponseDto>;
    handleRescheduleResponse(bookingId: string, approve: boolean): Promise<BookingResponseDto>;
}
