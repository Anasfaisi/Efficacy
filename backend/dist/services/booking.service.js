"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const mentorship_types_1 = require("@/types/mentorship.types");
const booking_mapper_1 = require("@/Mapper/booking.mapper");
const booking_status_types_1 = require("@/types/booking-status.types");
const role_types_1 = require("@/types/role.types");
const notification_enum_1 = require("@/types/notification.enum");
const response_messages_types_1 = require("@/types/response-messages.types");
const booking_policy_constant_1 = require("@/config/booking-policy.constant");
const extractId_1 = require("@/utils/extractId");
let BookingService = class BookingService {
    _bookingRepository;
    _mentorRepository;
    _userRepository;
    _notificationService;
    _mentorshipRepository;
    constructor(_bookingRepository, _mentorRepository, _userRepository, _notificationService, _mentorshipRepository) {
        this._bookingRepository = _bookingRepository;
        this._mentorRepository = _mentorRepository;
        this._userRepository = _userRepository;
        this._notificationService = _notificationService;
        this._mentorshipRepository = _mentorshipRepository;
    }
    async createBooking(data) {
        const bookingDate = new Date(data.bookingDate);
        const booking = booking_mapper_1.BookingMapper.fromCreateRequest(data, bookingDate);
        const userId = (0, extractId_1.extractId)(booking.userId);
        const mentorId = (0, extractId_1.extractId)(booking.mentorId);
        const hasBookingToday = await this._bookingRepository.hasExistingBooking(userId, booking.bookingDate);
        if (hasBookingToday) {
            throw new Error(response_messages_types_1.ErrorMessages.ExistingBookingDay);
        }
        const isAvailable = await this._bookingRepository.isSlotAvailable(mentorId, booking.bookingDate, booking.slot);
        if (!isAvailable) {
            throw new Error(response_messages_types_1.ErrorMessages.SlotAlreadyBooked);
        }
        const mentor = await this._mentorRepository.findById(mentorId);
        if (!mentor)
            throw new Error(response_messages_types_1.ErrorMessages.MentorNotFound);
        const dayName = booking.bookingDate.toLocaleDateString('en-US', {
            weekday: 'long',
        });
        if (!mentor.availability?.[dayName]?.includes(booking.slot)) {
            throw new Error(response_messages_types_1.ErrorMessages.MentorNotAvailableSlot);
        }
        const mentorship = await this._mentorshipRepository.findByUserIdAndMentorId(mentorId, userId);
        if (!mentorship || mentorship.status !== mentorship_types_1.MentorshipStatus.ACTIVE) {
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotActiveOrCompleted);
        }
        if (mentorship.usedSessions >= mentorship.totalSessions) {
            throw new Error(response_messages_types_1.ErrorMessages.NoSessionsRemaining);
        }
        const sevenDaysAgo = new Date(booking.bookingDate);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - booking_policy_constant_1.BookingPolicy.LOOKBACK_DAYS);
        const weeklyBookingCount = await this._bookingRepository.countBookingsInDateRange(userId, sevenDaysAgo, booking.bookingDate);
        if (weeklyBookingCount >= booking_policy_constant_1.BookingPolicy.WEEKLY_LIMIT) {
            throw new Error(response_messages_types_1.ErrorMessages.WeeklyBookingLimitReached);
        }
        console.log(weeklyBookingCount, weeklyBookingCount >= booking_policy_constant_1.BookingPolicy.WEEKLY_LIMIT, booking_policy_constant_1.BookingPolicy.WEEKLY_LIMIT, 'from booking service');
        const createdBooking = await this._bookingRepository.create(booking);
        const user = await this._userRepository.findById(userId);
        await this._notificationService.createNotification(mentorId, role_types_1.Role.Mentor, notification_enum_1.NotificationType.SYSTEM_ANNOUNCEMENT, response_messages_types_1.NotificationMessages.NewBookingRequestTitle, `${user?.name || 'A student'} has requested a session at ${booking.slot} on ${booking.bookingDate.toLocaleDateString()}.`, { bookingId: createdBooking.id });
        return booking_mapper_1.BookingMapper.toResponseDto(createdBooking);
    }
    async getBookingById(id) {
        const booking = await this._bookingRepository.findById(id);
        return booking ? booking_mapper_1.BookingMapper.toResponseDto(booking) : null;
    }
    async getUserBookings(userId, page = 1, limit = 10, status, startDate, endDate) {
        const { bookings, total } = await this._bookingRepository.findPaginatedByUser(userId, page, limit, status, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
        return {
            bookings: bookings.map(booking_mapper_1.BookingMapper.toResponseDto),
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getMentorBookings(mentorId, page = 1, limit = 5, status, startDate, endDate) {
        const { bookings, total } = await this._bookingRepository.findPaginatedByMentor(mentorId, page, limit, status, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
        return {
            bookings: bookings.map(booking_mapper_1.BookingMapper.toResponseDto),
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async updateBookingStatus(data) {
        const booking = await this._bookingRepository.findById(data.bookingId);
        if (!booking)
            throw new Error('Booking not found');
        const updateData = {
            status: data.status,
            ...(data.cancelReason ? { cancelReason: data.cancelReason } : {}),
        };
        const updatedBooking = await this._bookingRepository.update(data.bookingId, updateData);
        if (!updatedBooking)
            throw new Error(response_messages_types_1.ErrorMessages.BookingUpdateFailed);
        if (data.status === booking_status_types_1.BookingStatus.COMPLETED &&
            booking.status !== booking_status_types_1.BookingStatus.COMPLETED) {
            const mentorId = (0, extractId_1.extractId)(booking.mentorId);
            const userId = (0, extractId_1.extractId)(booking.userId);
            const mentor = await this._mentorRepository.findById(mentorId);
            if (mentor) {
                await this._mentorRepository.update(mentorId, {
                    sessionsCompleted: (mentor.sessionsCompleted || 0) + 1,
                });
            }
            const mentorship = await this._mentorshipRepository.findByUserIdAndMentorId(mentorId, userId);
            if (mentorship && mentorship.status === mentorship_types_1.MentorshipStatus.ACTIVE) {
                await this._mentorshipRepository.update(mentorship.id, {
                    usedSessions: (mentorship.usedSessions || 0) + 1,
                });
            }
        }
        const title = data.status === booking_status_types_1.BookingStatus.CONFIRMED
            ? response_messages_types_1.NotificationMessages.BookingConfirmedTitle
            : response_messages_types_1.NotificationMessages.BookingStatusUpdatedTitle;
        let message = `Your booking for ${booking.bookingDate.toLocaleDateString()} at ${booking.slot} is now ${data.status}.`;
        if (data.status === booking_status_types_1.BookingStatus.CANCELLED && data.cancelReason) {
            message += ` Reason: ${data.cancelReason}`;
        }
        await this._notificationService.createNotification((0, extractId_1.extractId)(booking.userId), role_types_1.Role.User, notification_enum_1.NotificationType.SYSTEM_ANNOUNCEMENT, title, message, { bookingId: booking.id });
        return booking_mapper_1.BookingMapper.toResponseDto(updatedBooking);
    }
    async requestReschedule(data) {
        const booking = await this._bookingRepository.findById(data.bookingId);
        if (!booking)
            throw new Error(response_messages_types_1.ErrorMessages.BookingNotFound);
        const proposedDate = new Date(data.proposedDate);
        const mentorId = (0, extractId_1.extractId)(booking.mentorId);
        const isAvailable = await this._bookingRepository.isSlotAvailable(mentorId, proposedDate, data.proposedSlot, data.bookingId);
        if (!isAvailable) {
            throw new Error(response_messages_types_1.ErrorMessages.SlotAlreadyBooked);
        }
        const now = new Date();
        const bookingTime = new Date(booking.bookingDate);
        const diffHours = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (data.requestedBy === 'user' && diffHours < 3) {
            throw new Error(response_messages_types_1.ErrorMessages.RescheduleTimeLimit);
        }
        const updatedBooking = await this._bookingRepository.update(data.bookingId, {
            status: booking_status_types_1.BookingStatus.RESCHEDULED,
            rescheduleBy: data.requestedBy,
            proposedDate: new Date(data.proposedDate),
            proposedSlot: data.proposedSlot,
        });
        if (!updatedBooking)
            throw new Error(response_messages_types_1.ErrorMessages.BookingUpdateFailed);
        const recipientId = data.requestedBy === 'user'
            ? (0, extractId_1.extractId)(booking.mentorId)
            : (0, extractId_1.extractId)(booking.userId);
        const recipientRole = data.requestedBy === 'user' ? role_types_1.Role.Mentor : role_types_1.Role.User;
        const senderName = data.requestedBy === 'user' ? 'Student' : 'Mentor';
        await this._notificationService.createNotification(recipientId, recipientRole, notification_enum_1.NotificationType.SYSTEM_ANNOUNCEMENT, response_messages_types_1.NotificationMessages.RescheduleRequestTitle, `${senderName} requested to reschedule the session to ${data.proposedSlot} on ${new Date(data.proposedDate).toLocaleDateString()}.`, {
            bookingId: booking.id,
            link: recipientRole === role_types_1.Role.Mentor
                ? '/mentor/booking-requests'
                : '/sessions',
        });
        return booking_mapper_1.BookingMapper.toResponseDto(updatedBooking);
    }
    async handleRescheduleResponse(bookingId, approve) {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking)
            throw new Error(response_messages_types_1.ErrorMessages.BookingNotFound);
        if (booking.status !== booking_status_types_1.BookingStatus.RESCHEDULED)
            throw new Error(response_messages_types_1.ErrorMessages.NoRescheduleRequest);
        let updatedBooking;
        if (approve) {
            const mentorId = (0, extractId_1.extractId)(booking.mentorId);
            const isAvailable = await this._bookingRepository.isSlotAvailable(mentorId, booking.proposedDate, booking.proposedSlot, bookingId);
            if (!isAvailable)
                throw new Error(response_messages_types_1.ErrorMessages.ProposedSlotUnavailable);
            updatedBooking = await this._bookingRepository.update(bookingId, {
                status: booking_status_types_1.BookingStatus.CONFIRMED,
                bookingDate: booking.proposedDate,
                slot: booking.proposedSlot,
                rescheduleBy: null,
                proposedDate: undefined,
                proposedSlot: undefined,
            });
        }
        else {
            updatedBooking = await this._bookingRepository.update(bookingId, {
                status: booking_status_types_1.BookingStatus.CANCELLED,
                rescheduleBy: null,
                proposedDate: undefined,
                proposedSlot: undefined,
            });
        }
        if (!updatedBooking)
            throw new Error(response_messages_types_1.ErrorMessages.BookingUpdateFailed);
        const recipientId = booking.rescheduleBy === 'user'
            ? (0, extractId_1.extractId)(booking.userId)
            : (0, extractId_1.extractId)(booking.mentorId);
        const recipientRole = booking.rescheduleBy === 'user' ? role_types_1.Role.User : role_types_1.Role.Mentor;
        await this._notificationService.createNotification(recipientId, recipientRole, notification_enum_1.NotificationType.SYSTEM_ANNOUNCEMENT, approve
            ? response_messages_types_1.NotificationMessages.RescheduleAcceptedTitle
            : response_messages_types_1.NotificationMessages.RescheduleRejectedTitle, approve
            ? `The session has been rescheduled.`
            : `The reschedule request was rejected and session is cancelled.`, { bookingId: booking.id });
        return booking_mapper_1.BookingMapper.toResponseDto(updatedBooking);
    }
    async verifyBookingAccess(bookingId, userId) {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking)
            return false;
        const bookingUserId = (0, extractId_1.extractId)(booking.userId);
        const bookingMentorId = (0, extractId_1.extractId)(booking.mentorId);
        const isParticipant = bookingUserId === userId || bookingMentorId === userId;
        const isConfirmed = booking.status === booking_status_types_1.BookingStatus.CONFIRMED;
        return isParticipant && isConfirmed;
    }
    async startSession(bookingId) {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking)
            throw new Error(response_messages_types_1.ErrorMessages.BookingNotFound);
        if (booking.actualStartTime)
            return booking_mapper_1.BookingMapper.toResponseDto(booking);
        const updated = await this._bookingRepository.update(bookingId, {
            actualStartTime: new Date(),
        });
        if (!updated)
            throw new Error(response_messages_types_1.ErrorMessages.BookingUpdateFailed);
        return booking_mapper_1.BookingMapper.toResponseDto(updated);
    }
    async endSession(bookingId) {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking)
            throw new Error(response_messages_types_1.ErrorMessages.BookingNotFound);
        if (!booking.actualStartTime)
            return booking_mapper_1.BookingMapper.toResponseDto(booking);
        const endTime = new Date();
        const diffMs = endTime.getTime() - booking.actualStartTime.getTime();
        const diffMins = Math.round(diffMs / (1000 * 60));
        const updateData = {
            actualEndTime: endTime,
            duration: diffMins,
        };
        if (diffMins >= 50 && booking.status !== booking_status_types_1.BookingStatus.COMPLETED) {
            updateData.status = booking_status_types_1.BookingStatus.COMPLETED;
            const mentorId = (0, extractId_1.extractId)(booking.mentorId);
            const userId = (0, extractId_1.extractId)(booking.userId);
            const mentor = await this._mentorRepository.findById(mentorId);
            if (mentor) {
                await this._mentorRepository.update(mentorId, {
                    sessionsCompleted: (mentor.sessionsCompleted || 0) + 1,
                });
            }
            const mentorship = await this._mentorshipRepository.findByUserIdAndMentorId(mentorId, userId);
            if (mentorship && mentorship.status === mentorship_types_1.MentorshipStatus.ACTIVE) {
                await this._mentorshipRepository.update(mentorship.id, {
                    usedSessions: (mentorship.usedSessions || 0) + 1,
                });
            }
        }
        const updated = await this._bookingRepository.update(bookingId, updateData);
        if (!updated)
            throw new Error(response_messages_types_1.ErrorMessages.BookingUpdateFailed);
        return booking_mapper_1.BookingMapper.toResponseDto(updated);
    }
    async getMentorAvailability(mentorId) {
        const bookings = await this._bookingRepository.getMentorBookedSlots(mentorId);
        return bookings.map((booking) => {
            if (booking.status === booking_status_types_1.BookingStatus.RESCHEDULED &&
                booking.proposedDate &&
                booking.proposedSlot) {
                return {
                    date: booking.proposedDate,
                    slot: booking.proposedSlot,
                };
            }
            return {
                date: booking.bookingDate,
                slot: booking.slot,
            };
        });
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BookingRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorRepository)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserRepository)),
    __param(3, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationService)),
    __param(4, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorshipRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], BookingService);
//# sourceMappingURL=booking.service.js.map