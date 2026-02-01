import { inject, injectable } from "inversify";
import { TYPES } from "@/config/inversify-key.types";
import { IBookingRepository } from "@/repositories/interfaces/IBooking.repository";
import { INotificationService } from "./Interfaces/INotification.service";
import { IMentorRepository } from "@/repositories/interfaces/IMentor.repository";
import { CreateBookingRequestDto, BookingResponseDto, UpdateBookingStatusRequestDto, RescheduleRequestDto } from "@/Dto/booking.dto";
import { BookingMapper } from "@/Mapper/booking.mapper";
import { BookingStatus } from "@/models/Booking.model";
import { BookingEntity } from "@/entity/booking.entity";
import { Role } from "@/types/role.types";
import { NotificationType } from "@/types/notification.enum";
import { IUserRepository } from "@/repositories/interfaces/IUser.repository";
import { IBookingService } from "@/serivces/Interfaces/IBooking.service";

@injectable()
export class BookingService implements IBookingService {
    constructor(
        @inject(TYPES.BookingRepository)
        private _bookingRepository: IBookingRepository,
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository,
        @inject(TYPES.UserRepository)
        private _userRepository: IUserRepository,
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService
    ) {}

    async createBooking(data: CreateBookingRequestDto): Promise<BookingResponseDto> {
        const bookingDate = new Date(data.bookingDate);
        
        // 1. Prevent more than one session per day (Check if user has any booking on this day)
        const hasBookingToday = await this._bookingRepository.hasExistingBooking(data.userId, bookingDate);
        if (hasBookingToday) {
            throw new Error("You already have a booking scheduled for this day. Only one session per day is allowed.");
        }

        // 2. Check if mentor is available at this slot (Double booking prevention)
        const isAvailable = await this._bookingRepository.isSlotAvailable(data.mentorId, bookingDate, data.slot);
        if (!isAvailable) {
            throw new Error("This slot is already booked for the mentor.");
        }

        // 3. Check mentor's configured availability
        const mentor = await this._mentorRepository.findById(data.mentorId);
        if (!mentor) throw new Error("Mentor not found");
        
        const dayName = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });
        if (!mentor.availableDays?.includes(dayName)) {
            throw new Error(`Mentor is not available on ${dayName}s.`);
        }
        if (!mentor.preferredTime?.includes(data.slot)) {
            throw new Error(`Mentor is not available at ${data.slot}.`);
        }

        // 4. Multiple booking prevention: Only 10 per 30 days
        const thirtyDaysAgo = new Date(bookingDate);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const bookingCount = await this._bookingRepository.countBookingsInDateRange(data.userId, thirtyDaysAgo, bookingDate);
        
        if (bookingCount >= 10) {
            throw new Error("You have reached the maximum limit of 10 bookings in a 30-day period.");
        }

        // 5. Create booking entity
        const bookingEntity = new BookingEntity(
            "", // ID will be generated
            data.userId,
            data.mentorId,
            bookingDate,
            data.slot,
            BookingStatus.PENDING,
            60, // 1 hour fixed
            data.topic,
            null,
            undefined,
            undefined,
            `https://meet.efficacy.com/${Math.random().toString(36).substring(7)}` // Dummy Room ID
        );

        const createdBooking = await this._bookingRepository.create(bookingEntity);

        // 6. Notify mentor
        const user = await this._userRepository.findById(data.userId);
        await this._notificationService.createNotification(
            data.mentorId,
            Role.Mentor,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            "New Booking Request",
            `${user?.name || 'A student'} has requested a session at ${data.slot} on ${bookingDate.toLocaleDateString()}.`,
            { bookingId: createdBooking.id }
        );

        return BookingMapper.toResponseDto(createdBooking);
    }

    async getBookingById(id: string): Promise<BookingResponseDto | null> {
        const booking = await this._bookingRepository.findById(id);
        return booking ? BookingMapper.toResponseDto(booking) : null;
    }

    async getUserBookings(userId: string): Promise<BookingResponseDto[]> {
        const bookings = await this._bookingRepository.findByUser(userId);
        return bookings.map(BookingMapper.toResponseDto);
    }

    async getMentorBookings(mentorId: string): Promise<BookingResponseDto[]> {
        const bookings = await this._bookingRepository.findByMentor(mentorId);
        return bookings.map(BookingMapper.toResponseDto);
    }

    async updateBookingStatus(data: UpdateBookingStatusRequestDto): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(data.bookingId);
        if (!booking) throw new Error("Booking not found");

        const updatedBooking = await this._bookingRepository.update(data.bookingId, { status: data.status });
        if (!updatedBooking) throw new Error("Failed to update booking");

        if (data.status === BookingStatus.COMPLETED) {
            const mentor = await this._mentorRepository.findById(booking.mentorId);
            if (mentor) {
                await this._mentorRepository.update(booking.mentorId, {
                    sessionsCompleted: (mentor.sessionsCompleted || 0) + 1
                } as any);
            }
        }

        // Notify user
        const title = data.status === BookingStatus.CONFIRMED ? "Booking Confirmed" : "Booking Status Updated";
        const message = `Your booking for ${booking.bookingDate.toLocaleDateString()} at ${booking.slot} is now ${data.status}.`;
        
        await this._notificationService.createNotification(
            booking.userId,
            Role.User,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            title,
            message,
            { bookingId: booking.id }
        );

        return BookingMapper.toResponseDto(updatedBooking);
    }

    async requestReschedule(data: RescheduleRequestDto): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(data.bookingId);
        if (!booking) throw new Error("Booking not found");

        const now = new Date();
        const bookingTime = new Date(booking.bookingDate);
        // Assuming slot is parsed roughly for the 3 hour check
        const diffHours = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (data.requestedBy === 'user' && diffHours < 3) {
            throw new Error("Reschedule requests must be made at least 3 hours before the session. If not, the session is lost.");
        }

        const updatedBooking = await this._bookingRepository.update(data.bookingId, {
            status: BookingStatus.RESCHEDULED,
            rescheduleBy: data.requestedBy,
            proposedDate: new Date(data.proposedDate),
            proposedSlot: data.proposedSlot
        });

        if (!updatedBooking) throw new Error("Failed to update booking");

        const recipientId = data.requestedBy === 'user' ? booking.mentorId : booking.userId;
        const recipientRole = data.requestedBy === 'user' ? Role.Mentor : Role.User;
        const senderName = data.requestedBy === 'user' ? 'Student' : 'Mentor';

        await this._notificationService.createNotification(
            recipientId,
            recipientRole,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            "Reschedule Request",
            `${senderName} requested to reschedule the session to ${data.proposedSlot} on ${new Date(data.proposedDate).toLocaleDateString()}.`,
            { bookingId: booking.id }
        );

        return BookingMapper.toResponseDto(updatedBooking);
    }

    async handleRescheduleResponse(bookingId: string, approve: boolean): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) throw new Error("Booking not found");
        if (booking.status !== BookingStatus.RESCHEDULED) throw new Error("No active reschedule request");

        let updatedBooking: BookingEntity | null;

        if (approve) {
            // Check if proposed slot is still available
            const isAvailable = await this._bookingRepository.isSlotAvailable(booking.mentorId, booking.proposedDate!, booking.proposedSlot!);
            if (!isAvailable) throw new Error("The proposed slot is no longer available.");

            updatedBooking = await this._bookingRepository.update(bookingId, {
                status: BookingStatus.CONFIRMED,
                bookingDate: booking.proposedDate,
                slot: booking.proposedSlot,
                rescheduleBy: null,
                proposedDate: undefined,
                proposedSlot: undefined
            });
        } else {
            updatedBooking = await this._bookingRepository.update(bookingId, {
                status: BookingStatus.CANCELLED,
                rescheduleBy: null,
                proposedDate: undefined,
                proposedSlot: undefined
            });
        }

        if (!updatedBooking) throw new Error("Failed to update booking");

        const recipientId = booking.rescheduleBy === 'user' ? booking.userId : booking.mentorId;
        const recipientRole = booking.rescheduleBy === 'user' ? Role.User : Role.Mentor;

        await this._notificationService.createNotification(
            recipientId,
            recipientRole,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            approve ? "Reschedule Accepted" : "Reschedule Rejected",
            approve ? `The session has been rescheduled.` : `The reschedule request was rejected and session is cancelled.`,
            { bookingId: booking.id }
        );

        return BookingMapper.toResponseDto(updatedBooking);
    }
}
