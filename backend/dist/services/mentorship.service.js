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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorshipService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const mentorship_types_1 = require("@/types/mentorship.types");
const notification_enum_1 = require("@/types/notification.enum");
const role_types_1 = require("@/types/role.types");
const mongoose_1 = require("mongoose");
const mentorship_dto_1 = require("@/dto/mentorship.dto");
const response_messages_types_1 = require("@/types/response-messages.types");
const mentorship_mapper_1 = require("@/Mapper/mentorship.mapper");
const stripe_1 = __importDefault(require("stripe"));
const payment_types_1 = require("@/types/payment.types");
let MentorshipService = class MentorshipService {
    _mentorshipRepository;
    _mentorRepository;
    _userRepository;
    _notificationService;
    _walletRepository;
    _adminRepository;
    _otpService;
    _stripe;
    constructor(_mentorshipRepository, _mentorRepository, _userRepository, _notificationService, _walletRepository, _adminRepository, _otpService) {
        this._mentorshipRepository = _mentorshipRepository;
        this._mentorRepository = _mentorRepository;
        this._userRepository = _userRepository;
        this._notificationService = _notificationService;
        this._walletRepository = _walletRepository;
        this._adminRepository = _adminRepository;
        this._otpService = _otpService;
        this._stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-08-27.basil',
        });
    }
    async createRequest(userId, mentorId, sessions, proposedStartDate) {
        if (proposedStartDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (proposedStartDate < today) {
                throw new Error(response_messages_types_1.ErrorMessages.PastDateBooking);
            }
        }
        const mentor = await this._mentorRepository.findById(mentorId);
        if (!mentor)
            throw new Error(response_messages_types_1.ErrorMessages.MentorNotFound);
        const existingMentorship = await this._mentorshipRepository.findByUserIdAndMentorId(mentorId, userId);
        if (existingMentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipAlreadyExists);
        const mentorship = await this._mentorshipRepository.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            mentorId: new mongoose_1.Types.ObjectId(mentorId),
            proposedStartDate,
            totalSessions: sessions,
            status: mentorship_types_1.MentorshipStatus.PENDING,
            amount: mentor.monthlyCharge || 0,
            paymentStatus: payment_types_1.PaymentStatus.PENDING,
            sessions: [],
        });
        await this._notificationService.createNotification(mentorId, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTORSHIP_REQUEST, response_messages_types_1.NotificationMessages.NewMentorshipRequestTitle, 'A user has requested a 1-month mentorship with you.', { mentorshipId: mentorship._id });
        return mentorship;
    }
    async getMentorRequests(mentorId, page = 1, limit = 10, status, search) {
        const { mentorships, total } = await this._mentorshipRepository.findPaginatedByMentorId(mentorId, page, limit, status, search);
        return new mentorship_dto_1.PaginatedMentorshipResponseDto(mentorships.map((m) => mentorship_mapper_1.MentorShipMapper.toEntity(m)), total, Math.ceil(total / limit), page);
    }
    async getUserRequests(userId) {
        return await this._mentorshipRepository.findByUserId(userId);
    }
    async respondToRequest(mentorshipId, mentorId, status, suggestedStartDate, reason) {
        if (suggestedStartDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (suggestedStartDate < today) {
                throw new Error(response_messages_types_1.ErrorMessages.PastDateBooking);
            }
        }
        const mentorship = await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        const currentMentorId = mentorship.mentorId instanceof mongoose_1.Types.ObjectId
            ? mentorship.mentorId.toString()
            : mentorship.mentorId?.id?.toString();
        if (currentMentorId !== mentorId)
            throw new Error(response_messages_types_1.CommonMessages.Unauthorized);
        mentorship.status =
            status === 'mentor_accepted'
                ? mentorship_types_1.MentorshipStatus.MENTOR_ACCEPTED
                : mentorship_types_1.MentorshipStatus.REJECTED;
        if (suggestedStartDate)
            mentorship.mentorSuggestedStartDate = suggestedStartDate;
        if (reason)
            mentorship.rejectionReason = reason;
        await this._mentorshipRepository.update(mentorshipId, mentorship);
        const recipientId = mentorship.userId instanceof mongoose_1.Types.ObjectId
            ? mentorship.userId.toString()
            : mentorship.userId?.id?.toString();
        if (recipientId) {
            await this._notificationService.createNotification(recipientId, role_types_1.Role.User, notification_enum_1.NotificationType.MENTORSHIP_RESPONSE, status === 'mentor_accepted'
                ? response_messages_types_1.NotificationMessages.MentorshipRequestAcceptedTitle
                : response_messages_types_1.NotificationMessages.MentorshipRequestRejectedTitle, status === 'mentor_accepted'
                ? `Mentor has accepted your request${suggestedStartDate ? ' with a suggested start date' : ''}.`
                : `Mentor has rejected your request: ${reason}`, { mentorshipId, status, link: '/my-mentorships' });
        }
        return mentorship;
    }
    async confirmMentorSuggestion(mentorshipId, userId, confirm) {
        const mentorship = await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        const mentorshipUserId = mentorship.userId.id?.toString() ||
            mentorship.userId.toString();
        if (mentorshipUserId !== userId)
            throw new Error(response_messages_types_1.CommonMessages.Unauthorized);
        if (confirm) {
            mentorship.status = mentorship_types_1.MentorshipStatus.PAYMENT_PENDING;
            mentorship.startDate =
                mentorship.mentorSuggestedStartDate ||
                    mentorship.proposedStartDate;
        }
        else {
            mentorship.status = mentorship_types_1.MentorshipStatus.CANCELLED;
        }
        await this._mentorshipRepository.update(mentorshipId, mentorship);
        const mentorId = mentorship.mentorId instanceof mongoose_1.Types.ObjectId
            ? mentorship.mentorId.toString()
            : mentorship.mentorId?.id?.toString();
        if (mentorId) {
            await this._notificationService.createNotification(mentorId, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTORSHIP_RESPONSE, confirm
                ? response_messages_types_1.NotificationMessages.MentorshipSuggestionAcceptedTitle
                : response_messages_types_1.NotificationMessages.MentorshipCancelledTitle, confirm
                ? `User has accepted your suggested dates. Mentorship is now pending payment.`
                : `User has declined your suggested dates and cancelled the request.`, { mentorshipId });
        }
        return mentorship;
    }
    async verifyPayment(mentorshipId, paymentId) {
        const mentorship = await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        mentorship.paymentId = paymentId;
        mentorship.paymentStatus = payment_types_1.PaymentStatus.VERIFIED;
        mentorship.status = mentorship_types_1.MentorshipStatus.ACTIVE;
        const start = mentorship.startDate || new Date();
        const end = new Date(start);
        end.setDate(end.getDate() + 30);
        mentorship.startDate = start;
        mentorship.endDate = end;
        const adminShare = mentorship.amount * 0.1;
        const mentorShare = mentorship.amount * 0.9;
        const currentMentorId = mentorship.mentorId instanceof mongoose_1.Types.ObjectId
            ? mentorship.mentorId.toString()
            : mentorship.mentorId.id?.toString();
        await this._adminRepository.addRevenue(adminShare);
        await this._walletRepository.creditPendingBalance(currentMentorId, mentorShare, `Mentorship Payment for Mentorship id #${mentorship._id}`);
        await this._mentorshipRepository.update(mentorshipId, mentorship);
        const currentUserId = mentorship.userId instanceof mongoose_1.Types.ObjectId
            ? mentorship.userId.toString()
            : mentorship.userId?.id?.toString();
        await this._notificationService.createNotification(currentUserId, role_types_1.Role.User, notification_enum_1.NotificationType.MENTORSHIP_ACTIVE, response_messages_types_1.NotificationMessages.MentorshipActiveTitle, `Your mentorship is now active until ${end.toLocaleDateString()}.`);
        const mentorIdForNotif = mentorship.mentorId instanceof mongoose_1.Types.ObjectId
            ? mentorship.mentorId.toString()
            : mentorship.mentorId?.id?.toString();
        if (mentorIdForNotif) {
            await this._notificationService.createNotification(mentorIdForNotif, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTORSHIP_ACTIVE, response_messages_types_1.NotificationMessages.MentorshipActiveTitle, `A new mentorship with user is now active.`, { mentorshipId });
        }
        return mentorship;
    }
    async getActiveMentorship(userId) {
        return await this._mentorshipRepository.findActiveByUserId(userId);
    }
    async getMentorshipById(id) {
        return await this._mentorshipRepository.findById(id);
    }
    async bookSession(mentorshipId, userId, date, slot) {
        const mentorship = await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        if (mentorship.userId.toString() !== userId)
            throw new Error(response_messages_types_1.CommonMessages.Unauthorized);
        if (mentorship.status !== mentorship_types_1.MentorshipStatus.ACTIVE)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotActive);
        if (mentorship.usedSessions >= mentorship.totalSessions)
            throw new Error(response_messages_types_1.ErrorMessages.NoSessionsRemaining);
        mentorship.sessions.push({
            date,
            slot,
            status: mentorship_types_1.SessionStatus.BOOKED,
        });
        mentorship.usedSessions += 1;
        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }
    async rescheduleSession(mentorshipId, sessionId, newDate, newSlot) {
        const mentorship = await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        const session = mentorship.sessions.id(sessionId);
        if (!session)
            throw new Error(response_messages_types_1.ErrorMessages.SessionNotFound);
        const now = new Date();
        const hoursDiff = (session.date.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 6)
            throw new Error(response_messages_types_1.ErrorMessages.RescheduleTimeLimitMentorship);
        session.date = newDate;
        session.slot = newSlot;
        session.status = mentorship_types_1.SessionStatus.RESCHEDULE_REQUESTED;
        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }
    async completeMentorship(mentorshipId, role) {
        const mentorship = await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        if (role === 'user')
            mentorship.userConfirmedCompletion = true;
        if (role === 'mentor')
            mentorship.mentorConfirmedCompletion = true;
        if (mentorship.userConfirmedCompletion &&
            mentorship.mentorConfirmedCompletion) {
            mentorship.status = mentorship_types_1.MentorshipStatus.COMPLETED;
            mentorship.completionInitiatedAt = undefined;
            await this.checkAndReleaseFunds(mentorship);
            const userIdForNotif = mentorship.userId instanceof mongoose_1.Types.ObjectId
                ? mentorship.userId.toString()
                : mentorship.userId?.id?.toString();
            if (userIdForNotif) {
                await this._notificationService.createNotification(userIdForNotif, role_types_1.Role.User, notification_enum_1.NotificationType.MENTORSHIP_COMPLETED, response_messages_types_1.NotificationMessages.MentorshipCompletedTitle, 'Your mentorship has been marked as completed. Please provide feedback.', { mentorshipId });
            }
            const mentorIdForNotif = mentorship.mentorId instanceof mongoose_1.Types.ObjectId
                ? mentorship.mentorId.toString()
                : mentorship.mentorId?.id?.toString();
            if (mentorIdForNotif) {
                await this._notificationService.createNotification(mentorIdForNotif, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTORSHIP_COMPLETED, response_messages_types_1.NotificationMessages.MentorshipCompletedTitle, 'Your mentorship has been marked as completed.', { mentorshipId });
            }
        }
        else {
            if (!mentorship.completionInitiatedAt) {
                mentorship.completionInitiatedAt = new Date();
            }
        }
        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }
    async runDailyCompletionCheck() {
        const today = new Date();
        const activeMentorships = await this._mentorshipRepository.findActiveMentorshipsForCompletionCheck();
        for (const mentorship of activeMentorships) {
            const endDate = mentorship.endDate
                ? new Date(mentorship.endDate)
                : null;
            if (!endDate)
                continue;
            const timeDiff = today.getTime() - endDate.getTime();
            const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
            const userEmail = mentorship.userId
                ?.email;
            const mentorEmail = mentorship.mentorId
                ?.email;
            if (daysPassed === 0 ||
                (daysPassed > 0 &&
                    daysPassed < 7 &&
                    !mentorship.completionInitiatedAt)) {
                await this._notificationService.createNotification(userEmail, role_types_1.Role.User, notification_enum_1.NotificationType.MENTORSHIP_COMPLETED, 'Mentorship Period Concluded', "Your 30-day mentorship has completed! Please confirm completion on your dashboard so we can unlock your mentor's payout.", { mentorshipId: mentorship._id });
                await this._notificationService.createNotification(mentorEmail, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTORSHIP_COMPLETED, 'Mentorship Period Concluded', 'Your 30-day mentorship guidance has completed! Please request completion on your dashboard to unlock your payout.', { mentorshipId: mentorship._id });
                if (userEmail) {
                    await this._otpService.sendEmail(userEmail, 'Confirm your Mentorship Completion - Efficacy', `Hi there,\n\nYour 30-day guidance period has concluded! Please log in to Efficacy and confirm your completion so we can release your mentor's payout.`);
                }
                if (mentorEmail) {
                    await this._otpService.sendEmail(mentorEmail, 'Mentorship Session Concluded - Efficacy', `Hi,\n\nYour 30-day guidance period has concluded! Please log in and request completion on your dashboard so we can clear your available balance.`);
                }
            }
            if (mentorship.completionInitiatedAt) {
                const initiatedDate = new Date(mentorship.completionInitiatedAt);
                const initiatedDiff = today.getTime() - initiatedDate.getTime();
                const initiatedDaysPassed = Math.floor(initiatedDiff / (1000 * 3600 * 24));
                if (initiatedDaysPassed >= 2) {
                    mentorship.status = mentorship_types_1.MentorshipStatus.COMPLETED;
                    mentorship.userConfirmedCompletion = true;
                    mentorship.mentorConfirmedCompletion = true;
                    await this.checkAndReleaseFunds(mentorship);
                    await this._mentorshipRepository.update(mentorship.id, mentorship);
                    continue;
                }
            }
            if (daysPassed >= 7) {
                mentorship.status = mentorship_types_1.MentorshipStatus.COMPLETED;
                mentorship.userConfirmedCompletion = true;
                mentorship.mentorConfirmedCompletion = true;
                await this.checkAndReleaseFunds(mentorship);
                await this._mentorshipRepository.update(mentorship.id, mentorship);
            }
        }
    }
    async submitFeedback(mentorshipId, role, rating, comment) {
        const mentorship = await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        if (role === 'user') {
            mentorship.userFeedback = { rating, comment };
        }
        else {
            mentorship.mentorFeedback = { rating, comment };
        }
        await this.checkAndReleaseFunds(mentorship);
        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }
    async cancelMentorship(mentorshipId, userId) {
        const mentorship = await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        const mentorshipUserId = mentorship.userId.id?.toString() ||
            mentorship.userId.toString();
        if (mentorshipUserId !== userId)
            throw new Error(response_messages_types_1.CommonMessages.Unauthorized);
        if (mentorship.status !== mentorship_types_1.MentorshipStatus.ACTIVE)
            throw new Error(response_messages_types_1.ErrorMessages.CancelOnlyActive);
        const startDate = mentorship.startDate || new Date();
        const diffDays = (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7)
            throw new Error(response_messages_types_1.ErrorMessages.CancellationExpired);
        const usedSessions = mentorship.usedSessions;
        if (usedSessions > 2)
            throw new Error(response_messages_types_1.MentorshipMessages.SessionsExceeded);
        let refundAmount = 0;
        if (usedSessions === 0) {
            refundAmount = mentorship.amount;
        }
        else {
            const deduction = usedSessions * 300;
            refundAmount = Math.max(0, mentorship.amount - deduction);
        }
        const originalAdminShare = mentorship.amount * 0.1;
        const originalMentorShare = mentorship.amount * 0.9;
        const retainedAmount = mentorship.amount - refundAmount;
        const retainedAdminShare = retainedAmount * 0.1;
        const retainedMentorShare = retainedAmount * 0.9;
        await this._adminRepository.addRevenue(retainedAdminShare - originalAdminShare);
        const currentMentorId = mentorship.mentorId instanceof mongoose_1.Types.ObjectId
            ? mentorship.mentorId.toString()
            : mentorship.mentorId.id?.toString();
        const debitAmount = originalMentorShare - retainedMentorShare;
        if (debitAmount > 0 && currentMentorId) {
            await this._walletRepository.debitPendingBalance(currentMentorId, debitAmount);
        }
        if (retainedMentorShare > 0 && currentMentorId) {
            await this._walletRepository.releasePendingBalance(currentMentorId, retainedMentorShare);
        }
        if (!mentorship.paymentId) {
            throw new Error('No Stripe session ID found for this mentorship.');
        }
        const session = await this._stripe.checkout.sessions.retrieve(mentorship.paymentId);
        const paymentIntentId = session.payment_intent;
        if (!paymentIntentId) {
            throw new Error('No Payment Intent found for this Stripe session.');
        }
        const refund = await this._stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: Math.round(refundAmount * 100),
            reason: 'requested_by_customer',
        });
        if (refund) {
            mentorship.status = mentorship_types_1.MentorshipStatus.CANCELLED;
            await this._mentorshipRepository.update(mentorshipId, mentorship);
            await this._notificationService.createNotification(userId, role_types_1.Role.User, notification_enum_1.NotificationType.MENTORSHIP_CANCELLED, response_messages_types_1.NotificationMessages.MentorshipCancelledTitle, `Mentorship cancelled successfully. A refund of ₹${refundAmount} has been initiated to your original payment method and will appear in 3-5 business days.`, { mentorshipId });
            return mentorship;
        }
        else {
            throw new Error(response_messages_types_1.MentorshipMessages.FailedToRefund);
        }
    }
    async checkAndReleaseFunds(mentorship) {
        if (mentorship.status === mentorship_types_1.MentorshipStatus.COMPLETED &&
            mentorship.paymentStatus === payment_types_1.PaymentStatus.VERIFIED) {
            const mentorShare = mentorship.amount * 0.9;
            const currentMentorId = mentorship.mentorId instanceof mongoose_1.Types.ObjectId
                ? mentorship.mentorId.toString()
                : mentorship.mentorId.id
                    ? mentorship.mentorId.id.toString()
                    : mentorship.mentorId.id?.toString();
            console.log(currentMentorId, 'currentMentorId =======');
            if (currentMentorId) {
                await this._walletRepository.releasePendingBalance(currentMentorId, mentorShare);
            }
            mentorship.paymentStatus = payment_types_1.PaymentStatus.PAID;
        }
    }
    async findByUserIdAndMentorId(mentorId, userId) {
        return await this._mentorshipRepository.findByUserIdAndMentorId(mentorId, userId);
    }
};
exports.MentorshipService = MentorshipService;
exports.MentorshipService = MentorshipService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorshipRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorRepository)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserRepository)),
    __param(3, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationService)),
    __param(4, (0, inversify_1.inject)(inversify_key_types_1.TYPES.WalletRepository)),
    __param(5, (0, inversify_1.inject)(inversify_key_types_1.TYPES.AdminRepository)),
    __param(6, (0, inversify_1.inject)(inversify_key_types_1.TYPES.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], MentorshipService);
//# sourceMappingURL=mentorship.service.js.map