import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IBookingRepository } from '@/repositories/interfaces/IBooking.repository';
import { INotificationService } from './Interfaces/INotification.service';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IMentorshipRepository } from '@/repositories/interfaces/IMentorship.repository';
import { MentorshipStatus } from '@/models/Mentorship.model';
import {
    CreateBookingRequestDto,
    BookingResponseDto,
    UpdateBookingStatusRequestDto,
    RescheduleRequestDto,
    PaginatedBookingResponseDto,
} from '@/Dto/booking.dto';
import { BookingMapper } from '@/Mapper/booking.mapper';
import { BookingStatus } from '@/types/booking-status.types';
import { BookingEntity } from '@/entity/booking.entity';
import { Role } from '@/types/role.types';
import { NotificationType } from '@/types/notification.enum';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { IBookingService } from '@/serivces/Interfaces/IBooking.service';
import {
    ErrorMessages,
    NotificationMessages,
} from '@/types/response-messages.types';
import { BookingPolicy } from '@/config/booking-policy.constant';

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
        private _notificationService: INotificationService,
        @inject(TYPES.MentorshipRepository)
        private _mentorshipRepository: IMentorshipRepository
    ) {}

    private _extractId(
        field: string | { id?: string; _id?: unknown } | unknown
    ): string {
        if (!field) return '';
        if (typeof field === 'string') return field;

        if (typeof field === 'object') {
            const f = field as {
                id?: unknown;
                _id?: unknown;
                toHexString?: () => string;
            };

            // Priority 1: _id (Mongoose objects/docs)
            if (f._id) return String(f._id);

            // Priority 2: id IF it is a string (Entities)
            if (typeof f.id === 'string') return f.id;

            // Priority 3: toHexString() (Mongoose ObjectId)
            if (typeof f.toHexString === 'function') return f.toHexString();

            // Priority 4: toString() fallback
            if (
                typeof (field as { toString: () => string }).toString ===
                'function'
            ) {
                const s = (field as { toString: () => string }).toString();
                if (s !== '[object Object]') return s;
            }
        }

        return String(field);
    }

    async createBooking(
        data: CreateBookingRequestDto
    ): Promise<BookingResponseDto> {
        const bookingDate = new Date(data.bookingDate);
        const booking = BookingMapper.fromCreateRequest(data, bookingDate);

        const userId = this._extractId(booking.userId);
        const mentorId = this._extractId(booking.mentorId);

        const hasBookingToday =
            await this._bookingRepository.hasExistingBooking(
                userId,
                booking.bookingDate
            );
        if (hasBookingToday) {
            throw new Error(ErrorMessages.ExistingBookingDay);
        }

        const isAvailable = await this._bookingRepository.isSlotAvailable(
            mentorId,
            booking.bookingDate,
            booking.slot
        );
        if (!isAvailable) {
            throw new Error(ErrorMessages.SlotAlreadyBooked);
        }

        const mentor = await this._mentorRepository.findById(mentorId);
        if (!mentor) throw new Error(ErrorMessages.MentorNotFound);

        const dayName = booking.bookingDate.toLocaleDateString('en-US', {
            weekday: 'long',
        });
        if (!mentor.availableDays?.includes(dayName)) {
            throw new Error(ErrorMessages.MentorNotAvailableDay);
        }
        if (!mentor.preferredTime?.includes(booking.slot)) {
            throw new Error(ErrorMessages.MentorNotAvailableSlot);
        }

        const mentorship =
            await this._mentorshipRepository.findByUserIdAndMentorId(
                mentorId,
                userId
            );

        if (!mentorship || mentorship.status !== MentorshipStatus.ACTIVE) {
            throw new Error(ErrorMessages.MentorshipNotActiveOrCompleted);
        }

        if (mentorship.usedSessions >= mentorship.totalSessions) {
            throw new Error(ErrorMessages.NoSessionsRemaining);
        }

        const sevenDaysAgo = new Date(booking.bookingDate);
        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - BookingPolicy.LOOKBACK_DAYS
        );
        const weeklyBookingCount =
            await this._bookingRepository.countBookingsInDateRange(
                userId,
                sevenDaysAgo,
                booking.bookingDate
            );

        if (weeklyBookingCount >= BookingPolicy.WEEKLY_LIMIT) {
            throw new Error(ErrorMessages.WeeklyBookingLimitReached);
        }
        console.log(
            weeklyBookingCount,
            weeklyBookingCount >= BookingPolicy.WEEKLY_LIMIT,
            BookingPolicy.WEEKLY_LIMIT,
            'from booking service'
        );
        const createdBooking = await this._bookingRepository.create(booking);

        const user = await this._userRepository.findById(userId);
        await this._notificationService.createNotification(
            mentorId,
            Role.Mentor,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            NotificationMessages.NewBookingRequestTitle,
            `${user?.name || 'A student'} has requested a session at ${booking.slot} on ${booking.bookingDate.toLocaleDateString()}.`,
            { bookingId: createdBooking.id }
        );

        return BookingMapper.toResponseDto(createdBooking);
    }

    async getBookingById(id: string): Promise<BookingResponseDto | null> {
        const booking = await this._bookingRepository.findById(id);
        return booking ? BookingMapper.toResponseDto(booking) : null;
    }

    async getUserBookings(
        userId: string,
        page: number = 1,
        limit: number = 10,
        status?: string,
        startDate?: string,
        endDate?: string
    ): Promise<PaginatedBookingResponseDto> {
        const { bookings, total } =
            await this._bookingRepository.findPaginatedByUser(
                userId,
                page,
                limit,
                status,
                startDate ? new Date(startDate) : undefined,
                endDate ? new Date(endDate) : undefined
            );
        return {
            bookings: bookings.map(BookingMapper.toResponseDto),
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }

    async getMentorBookings(
        mentorId: string,
        page: number = 1,
        limit: number = 5,
        status?: string,
        startDate?: string,
        endDate?: string
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

    async updateBookingStatus(
        data: UpdateBookingStatusRequestDto
    ): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(data.bookingId);
        if (!booking) throw new Error('Booking not found');

        const updateData: Partial<BookingEntity> = {
            status: data.status,
            ...(data.cancelReason ? { cancelReason: data.cancelReason } : {}),
        };

        const updatedBooking = await this._bookingRepository.update(
            data.bookingId,
            updateData
        );
        if (!updatedBooking) throw new Error(ErrorMessages.BookingUpdateFailed);

        if (data.status === BookingStatus.COMPLETED && booking.status !== BookingStatus.COMPLETED) {
            const mentorId = this._extractId(booking.mentorId);
            const userId = this._extractId(booking.userId);
            
            const mentor = await this._mentorRepository.findById(mentorId);
            if (mentor) {
                await this._mentorRepository.update(mentorId, {
                    sessionsCompleted: (mentor.sessionsCompleted || 0) + 1,
                });
            }

            const mentorship = await this._mentorshipRepository.findByUserIdAndMentorId(mentorId, userId);
            if (mentorship && mentorship.status === MentorshipStatus.ACTIVE) {
                await this._mentorshipRepository.update(mentorship.id, {
                    usedSessions: (mentorship.usedSessions || 0) + 1
                });
            }
        }

        const title =
            data.status === BookingStatus.CONFIRMED
                ? NotificationMessages.BookingConfirmedTitle
                : NotificationMessages.BookingStatusUpdatedTitle;
        let message = `Your booking for ${booking.bookingDate.toLocaleDateString()} at ${booking.slot} is now ${data.status}.`;
        if (data.status === BookingStatus.CANCELLED && data.cancelReason) {
            message += ` Reason: ${data.cancelReason}`;
        }

        await this._notificationService.createNotification(
            this._extractId(booking.userId),
            Role.User,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            title,
            message,
            { bookingId: booking.id }
        );

        return BookingMapper.toResponseDto(updatedBooking);
    }

    async requestReschedule(
        data: RescheduleRequestDto
    ): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(data.bookingId);
        if (!booking) throw new Error(ErrorMessages.BookingNotFound);

        const proposedDate = new Date(data.proposedDate);

        const mentorId = this._extractId(booking.mentorId);
        const isAvailable = await this._bookingRepository.isSlotAvailable(
            mentorId,
            proposedDate,
            data.proposedSlot,
            data.bookingId
        );
        if (!isAvailable) {
            throw new Error(ErrorMessages.SlotAlreadyBooked);
        }

        const now = new Date();
        const bookingTime = new Date(booking.bookingDate);
        const diffHours =
            (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (data.requestedBy === 'user' && diffHours < 3) {
            throw new Error(ErrorMessages.RescheduleTimeLimit);
        }

        const updatedBooking = await this._bookingRepository.update(
            data.bookingId,
            {
                status: BookingStatus.RESCHEDULED,
                rescheduleBy: data.requestedBy,
                proposedDate: new Date(data.proposedDate),
                proposedSlot: data.proposedSlot,
            }
        );

        if (!updatedBooking) throw new Error(ErrorMessages.BookingUpdateFailed);

        const recipientId =
            data.requestedBy === 'user'
                ? this._extractId(booking.mentorId)
                : this._extractId(booking.userId);
        const recipientRole =
            data.requestedBy === 'user' ? Role.Mentor : Role.User;
        const senderName = data.requestedBy === 'user' ? 'Student' : 'Mentor';

        await this._notificationService.createNotification(
            recipientId,
            recipientRole,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            NotificationMessages.RescheduleRequestTitle,
            `${senderName} requested to reschedule the session to ${data.proposedSlot} on ${new Date(data.proposedDate).toLocaleDateString()}.`,
            {
                bookingId: booking.id,
                link:
                    recipientRole === Role.Mentor
                        ? '/mentor/booking-requests'
                        : '/sessions',
            }
        );

        return BookingMapper.toResponseDto(updatedBooking);
    }

    async handleRescheduleResponse(
        bookingId: string,
        approve: boolean
    ): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) throw new Error(ErrorMessages.BookingNotFound);
        if (booking.status !== BookingStatus.RESCHEDULED)
            throw new Error(ErrorMessages.NoRescheduleRequest);

        let updatedBooking: BookingEntity | null;

        if (approve) {
            const mentorId = this._extractId(booking.mentorId);
            const isAvailable = await this._bookingRepository.isSlotAvailable(
                mentorId,
                booking.proposedDate!,
                booking.proposedSlot!,
                bookingId
            );
            if (!isAvailable)
                throw new Error(ErrorMessages.ProposedSlotUnavailable);

            updatedBooking = await this._bookingRepository.update(bookingId, {
                status: BookingStatus.CONFIRMED,
                bookingDate: booking.proposedDate,
                slot: booking.proposedSlot,
                rescheduleBy: null,
                proposedDate: undefined,
                proposedSlot: undefined,
            });
        } else {
            updatedBooking = await this._bookingRepository.update(bookingId, {
                status: BookingStatus.CANCELLED,
                rescheduleBy: null,
                proposedDate: undefined,
                proposedSlot: undefined,
            });
        }

        if (!updatedBooking) throw new Error(ErrorMessages.BookingUpdateFailed);

        const recipientId =
            booking.rescheduleBy === 'user'
                ? this._extractId(booking.userId)
                : this._extractId(booking.mentorId);
        const recipientRole =
            booking.rescheduleBy === 'user' ? Role.User : Role.Mentor;

        await this._notificationService.createNotification(
            recipientId,
            recipientRole,
            NotificationType.SYSTEM_ANNOUNCEMENT,
            approve
                ? NotificationMessages.RescheduleAcceptedTitle
                : NotificationMessages.RescheduleRejectedTitle,
            approve
                ? `The session has been rescheduled.`
                : `The reschedule request was rejected and session is cancelled.`,
            { bookingId: booking.id }
        );

        return BookingMapper.toResponseDto(updatedBooking);
    }

    async verifyBookingAccess(
        bookingId: string,
        userId: string
    ): Promise<boolean> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) return false;

        const bookingUserId = this._extractId(booking.userId);
        const bookingMentorId = this._extractId(booking.mentorId);

        const isParticipant =
            bookingUserId === userId || bookingMentorId === userId;
        const isConfirmed = booking.status === BookingStatus.CONFIRMED;
        return isParticipant && isConfirmed;
    }

    async startSession(bookingId: string): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) throw new Error(ErrorMessages.BookingNotFound);

        if (booking.actualStartTime) return BookingMapper.toResponseDto(booking);

        const updated = await this._bookingRepository.update(bookingId, {
            actualStartTime: new Date(),
        });
        if (!updated) throw new Error(ErrorMessages.BookingUpdateFailed);

        return BookingMapper.toResponseDto(updated);
    }

    async endSession(bookingId: string): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) throw new Error(ErrorMessages.BookingNotFound);
        if (!booking.actualStartTime) return BookingMapper.toResponseDto(booking);

        const endTime = new Date();
        const diffMs = endTime.getTime() - booking.actualStartTime.getTime();
        const diffMins = Math.round(diffMs / (1000 * 60));

        const updateData: Partial<BookingEntity> = {
            actualEndTime: endTime,
            sessionMinutes: diffMins,
        };

        
        if (diffMins >= 50 && booking.status !== BookingStatus.COMPLETED) {
            updateData.status = BookingStatus.COMPLETED;
            
            const mentorId = this._extractId(booking.mentorId);
            const userId = this._extractId(booking.userId);
            
            const mentor = await this._mentorRepository.findById(mentorId);
            if (mentor) {
                await this._mentorRepository.update(mentorId, {
                    sessionsCompleted: (mentor.sessionsCompleted || 0) + 1,
                });
            }

            const mentorship = await this._mentorshipRepository.findByUserIdAndMentorId(mentorId, userId);
            if (mentorship && mentorship.status === MentorshipStatus.ACTIVE) {
                await this._mentorshipRepository.update(mentorship.id, {
                    usedSessions: (mentorship.usedSessions || 0) + 1
                });
            }
        }

        const updated = await this._bookingRepository.update(bookingId, updateData);
        if (!updated) throw new Error(ErrorMessages.BookingUpdateFailed);

        return BookingMapper.toResponseDto(updated);
    }
}
