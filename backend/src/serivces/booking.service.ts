import { inject, injectable } from "inversify";
import { TYPES } from "@/config/inversify-key.types";
import { IBookingRepository } from "@/repositories/interfaces/IBooking.repository";
import { INotificationService } from "./Interfaces/INotification.service";
import { IMentorRepository } from "@/repositories/interfaces/IMentor.repository";
import { CreateBookingRequestDto, BookingResponseDto, UpdateBookingStatusRequestDto, RescheduleRequestDto, PaginatedBookingResponseDto } from "@/Dto/booking.dto";
import { BookingMapper } from "@/Mapper/booking.mapper";
import { BookingStatus } from "@/models/Booking.model";
import { BookingEntity } from "@/entity/booking.entity";
import { Role } from "@/types/role.types";
import { NotificationType } from "@/types/notification.enum";
import { IUserRepository } from "@/repositories/interfaces/IUser.repository";
import { IBookingService } from "@/serivces/Interfaces/IBooking.service";
import { ErrorMessages, NotificationMessages } from "@/types/response-messages.types";

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
        
        // 0. Prevent booking for past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
            throw new Error(ErrorMessages.PastDateBooking);
        }
        
        // 1. Prevent more than one session per day (Check if user has any booking on this day)
        const hasBookingToday = await this._bookingRepository.hasExistingBooking(data.userId, bookingDate);
        if (hasBookingToday) {
            throw new Error(ErrorMessages.ExistingBookingDay);
        }

        const isAvailable = await this._bookingRepository.isSlotAvailable(data.mentorId, bookingDate, data.slot);
        if (!isAvailable) {
            throw new Error(ErrorMessages.SlotAlreadyBooked);
        }

        const mentor = await this._mentorRepository.findById(data.mentorId);
        console.log(mentor,"mentor from booking service");
        if (!mentor) throw new Error(ErrorMessages.MentorNotFound);
        
        const dayName = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });
        if (!mentor.availableDays?.includes(dayName)) {
            throw new Error(ErrorMessages.MentorNotAvailableDay);
        }
        console.log(data.slot,"slot from booking service")
        if (!mentor.preferredTime?.includes(data.slot)) {
            throw new Error(ErrorMessages.MentorNotAvailableSlot);
        }

        const thirtyDaysAgo = new Date(bookingDate);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const bookingCount = await this._bookingRepository.countBookingsInDateRange(data.userId, thirtyDaysAgo, bookingDate);
        
        if (bookingCount >= 10) {
            throw new Error(ErrorMessages.BookingLimitReached);
        }

        const bookingEntity = new BookingEntity(
            "",
            data.userId,
            data.mentorId,
            bookingDate,
            data.slot,
            BookingStatus.PENDING,
            60,
            data.topic,
            null,
            undefined,
            undefined,
            `#` // Dummy Room ID
        );

        const createdBooking = await this._bookingRepository.create(bookingEntity);

        // 6. Notify mentor
        const user = await this._userRepository.findById(data.userId);
        await this._notificationService.createNotification(
            data.mentorId,
            Role.Mentor,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            NotificationMessages.NewBookingRequestTitle,
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

    async getMentorBookings(
        mentorId: string,
        page: number = 1,
        limit: number = 10,
        status?: string
    ): Promise<PaginatedBookingResponseDto> {
        const { bookings, total } =
            await this._bookingRepository.findPaginatedByMentor(
                mentorId,
                page,
                limit,
                status
            );
        return {
            bookings: bookings.map(BookingMapper.toResponseDto),
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }

    async updateBookingStatus(data: UpdateBookingStatusRequestDto): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(data.bookingId);
        if (!booking) throw new Error("Booking not found");

        const updatedBooking = await this._bookingRepository.update(data.bookingId, { status: data.status });
        if (!updatedBooking) throw new Error(ErrorMessages.BookingUpdateFailed);

        if (data.status === BookingStatus.COMPLETED) {
            const mentor = await this._mentorRepository.findById(booking.mentorId);
            if (mentor) {
                await this._mentorRepository.update(booking.mentorId, {
                    sessionsCompleted: (mentor.sessionsCompleted || 0) + 1
                });
            }
        }

        // Notify user
        const title = data.status === BookingStatus.CONFIRMED ? NotificationMessages.BookingConfirmedTitle : NotificationMessages.BookingStatusUpdatedTitle;
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
        if (!booking) throw new Error(ErrorMessages.BookingNotFound);

        const proposedDate = new Date(data.proposedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (proposedDate < today) {
            throw new Error(ErrorMessages.PastDateReschedule);
        }

        const now = new Date();
        const bookingTime = new Date(booking.bookingDate);
        // Assuming slot is parsed roughly for the 3 hour check
        const diffHours = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (data.requestedBy === 'user' && diffHours < 3) {
            throw new Error(ErrorMessages.RescheduleTimeLimit);
        }

        const updatedBooking = await this._bookingRepository.update(data.bookingId, {
            status: BookingStatus.RESCHEDULED,
            rescheduleBy: data.requestedBy,
            proposedDate: new Date(data.proposedDate),
            proposedSlot: data.proposedSlot
        });

        if (!updatedBooking) throw new Error(ErrorMessages.BookingUpdateFailed);

        const recipientId = data.requestedBy === 'user' ? booking.mentorId : booking.userId;
        const recipientRole = data.requestedBy === 'user' ? Role.Mentor : Role.User;
        const senderName = data.requestedBy === 'user' ? 'Student' : 'Mentor';

        await this._notificationService.createNotification(
            recipientId,
            recipientRole,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            NotificationMessages.RescheduleRequestTitle,
            `${senderName} requested to reschedule the session to ${data.proposedSlot} on ${new Date(data.proposedDate).toLocaleDateString()}.`,
            { bookingId: booking.id }
        );

        return BookingMapper.toResponseDto(updatedBooking);
    }

    async handleRescheduleResponse(bookingId: string, approve: boolean): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) throw new Error(ErrorMessages.BookingNotFound);
        if (booking.status !== BookingStatus.RESCHEDULED) throw new Error(ErrorMessages.NoRescheduleRequest);

        let updatedBooking: BookingEntity | null;

        if (approve) {
            // Check if proposed slot is still available
            const isAvailable = await this._bookingRepository.isSlotAvailable(booking.mentorId, booking.proposedDate!, booking.proposedSlot!);
            if (!isAvailable) throw new Error(ErrorMessages.ProposedSlotUnavailable);

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

        if (!updatedBooking) throw new Error(ErrorMessages.BookingUpdateFailed);

        const recipientId = booking.rescheduleBy === 'user' ? booking.userId : booking.mentorId;
        const recipientRole = booking.rescheduleBy === 'user' ? Role.User : Role.Mentor;

        await this._notificationService.createNotification(
            recipientId,
            recipientRole,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            approve ? NotificationMessages.RescheduleAcceptedTitle : NotificationMessages.RescheduleRejectedTitle,
            approve ? `The session has been rescheduled.` : `The reschedule request was rejected and session is cancelled.`,
            { bookingId: booking.id }
        );

        return BookingMapper.toResponseDto(updatedBooking);
    }
}
