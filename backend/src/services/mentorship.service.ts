import { injectable, inject } from 'inversify';
import { IMentorshipService } from './Interfaces/IMentorship.service';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorshipRepository } from '@/repositories/interfaces/IMentorship.repository';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { INotificationService } from './Interfaces/INotification.service';
import { IWalletRepository } from '@/repositories/interfaces/IWallet.repository';
import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { IAdmin } from '@/models/admin.model';
import { IMentorship, ISession } from '@/models/mentorship.model';
import { MentorshipStatus, SessionStatus } from '@/types/mentorship.types';
import { NotificationType } from '@/types/notification.enum';
import { Role } from '@/types/role.types';
import { ObjectId, Types } from 'mongoose';
import { PaginatedMentorshipResponseDto } from '@/dto/mentorship.dto';
import {
    ErrorMessages,
    CommonMessages,
    NotificationMessages,
    MentorshipMessages,
} from '@/types/response-messages.types';
import { MentorEntity } from '@/entity/mentor.entity';
import { UserEntity } from '@/entity/user.entity';
import { IOtpService } from './Interfaces/IOtp.service';
import { MentorShipMapper } from '@/Mapper/mentorship.mapper';
import Stripe from 'stripe';
import { PaymentStatus } from '@/types/payment.types';

@injectable()
export class MentorshipService implements IMentorshipService {
    private _stripe: Stripe;
    constructor(
        @inject(TYPES.MentorshipRepository)
        private _mentorshipRepository: IMentorshipRepository,
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository,
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService,
        @inject(TYPES.WalletRepository)
        private _walletRepository: IWalletRepository,
        @inject(TYPES.AdminRepository)
        private _adminRepository: IAdminRepository<IAdmin>,
        @inject(TYPES.OtpService)
        private _otpService: IOtpService
    ) {
        this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-08-27.basil',
        });
    }

    async createRequest(
        userId: string,
        mentorId: string,
        sessions: number,
        proposedStartDate?: Date
    ): Promise<IMentorship> {
        if (proposedStartDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (proposedStartDate < today) {
                throw new Error(ErrorMessages.PastDateBooking);
            }
        }
        const mentor = await this._mentorRepository.findById(
            mentorId as string
        );
        if (!mentor) throw new Error(ErrorMessages.MentorNotFound);
        const existingMentorship =
            await this._mentorshipRepository.findByUserIdAndMentorId(
                mentorId,
                userId
            );
        if (existingMentorship)
            throw new Error(ErrorMessages.MentorshipAlreadyExists);
        const mentorship = await this._mentorshipRepository.create({
            userId: new Types.ObjectId(userId),
            mentorId: new Types.ObjectId(mentorId),
            proposedStartDate,
            totalSessions: sessions,
            status: MentorshipStatus.PENDING,
            amount: mentor.monthlyCharge || 0,
            paymentStatus: PaymentStatus.PENDING,
            sessions: [],
        });

        await this._notificationService.createNotification(
            mentorId as string,
            Role.Mentor,
            NotificationType.MENTORSHIP_REQUEST,
            NotificationMessages.NewMentorshipRequestTitle,
            'A user has requested a 1-month mentorship with you.',
            { mentorshipId: mentorship._id }
        );

        return mentorship;
    }

    async getMentorRequests(
        mentorId: string | ObjectId,
        page: number = 1,
        limit: number = 10,
        status?: string,
        search?: string
    ): Promise<PaginatedMentorshipResponseDto> {
        const { mentorships, total } =
            await this._mentorshipRepository.findPaginatedByMentorId(
                mentorId,
                page,
                limit,
                status,
                search
            );

        return new PaginatedMentorshipResponseDto(
            mentorships.map((m) => MentorShipMapper.toEntity(m)),
            total,
            Math.ceil(total / limit),
            page
        );
    }

    async getUserRequests(userId: string | ObjectId): Promise<IMentorship[]> {
        return await this._mentorshipRepository.findByUserId(userId);
    }

    async respondToRequest(
        mentorshipId: string,
        mentorId: string,
        status: 'mentor_accepted' | 'rejected',
        suggestedStartDate?: Date,
        reason?: string
    ): Promise<IMentorship> {
        if (suggestedStartDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (suggestedStartDate < today) {
                throw new Error(ErrorMessages.PastDateBooking);
            }
        }
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);
        const currentMentorId =
            mentorship.mentorId instanceof Types.ObjectId
                ? mentorship.mentorId.toString()
                : (
                      mentorship.mentorId as unknown as MentorEntity
                  )?.id?.toString();
        if (currentMentorId !== mentorId)
            throw new Error(CommonMessages.Unauthorized);

        mentorship.status =
            status === 'mentor_accepted'
                ? MentorshipStatus.MENTOR_ACCEPTED
                : MentorshipStatus.REJECTED;
        if (suggestedStartDate)
            mentorship.mentorSuggestedStartDate = suggestedStartDate;
        if (reason) mentorship.rejectionReason = reason;

        await this._mentorshipRepository.update(mentorshipId, mentorship);

        const recipientId =
            mentorship.userId instanceof Types.ObjectId
                ? mentorship.userId.toString()
                : (mentorship.userId as unknown as UserEntity)?.id?.toString();

        if (recipientId) {
            await this._notificationService.createNotification(
                recipientId,
                Role.User,
                NotificationType.MENTORSHIP_RESPONSE,
                status === 'mentor_accepted'
                    ? NotificationMessages.MentorshipRequestAcceptedTitle
                    : NotificationMessages.MentorshipRequestRejectedTitle,
                status === 'mentor_accepted'
                    ? `Mentor has accepted your request${suggestedStartDate ? ' with a suggested start date' : ''}.`
                    : `Mentor has rejected your request: ${reason}`,
                { mentorshipId, status, link: '/my-mentorships' }
            );
        }

        return mentorship;
    }

    async confirmMentorSuggestion(
        mentorshipId: string,
        userId: string,
        confirm: boolean
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);
        const mentorshipUserId =
            (mentorship.userId as unknown as UserEntity).id?.toString() ||
            mentorship.userId.toString();
        if (mentorshipUserId !== userId)
            throw new Error(CommonMessages.Unauthorized);

        if (confirm) {
            mentorship.status = MentorshipStatus.PAYMENT_PENDING;
            mentorship.startDate =
                mentorship.mentorSuggestedStartDate ||
                mentorship.proposedStartDate;
        } else {
            mentorship.status = MentorshipStatus.CANCELLED;
        }

        await this._mentorshipRepository.update(mentorshipId, mentorship);

        const mentorId =
            mentorship.mentorId instanceof Types.ObjectId
                ? mentorship.mentorId.toString()
                : (
                      mentorship.mentorId as unknown as MentorEntity
                  )?.id?.toString();

        if (mentorId) {
            await this._notificationService.createNotification(
                mentorId,
                Role.Mentor,
                NotificationType.MENTORSHIP_RESPONSE,
                confirm
                    ? NotificationMessages.MentorshipSuggestionAcceptedTitle
                    : NotificationMessages.MentorshipCancelledTitle,
                confirm
                    ? `User has accepted your suggested dates. Mentorship is now pending payment.`
                    : `User has declined your suggested dates and cancelled the request.`,
                { mentorshipId }
            );
        }

        return mentorship;
    }

    async verifyPayment(
        mentorshipId: string,
        paymentId: string
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);

        mentorship.paymentId = paymentId;
        mentorship.paymentStatus = PaymentStatus.VERIFIED;
        mentorship.status = MentorshipStatus.ACTIVE;

        const start = mentorship.startDate || new Date();
        const end = new Date(start);
        end.setDate(end.getDate() + 30);
        mentorship.startDate = start;
        mentorship.endDate = end;

        const adminShare = mentorship.amount * 0.1;
        const mentorShare = mentorship.amount * 0.9;

        const currentMentorId =
            mentorship.mentorId instanceof Types.ObjectId
                ? mentorship.mentorId.toString()
                : (
                      mentorship.mentorId as unknown as MentorEntity
                  ).id?.toString();
        await this._adminRepository.addRevenue(adminShare);
        await this._walletRepository.creditPendingBalance(
            currentMentorId,
            mentorShare,
            `Mentorship Payment for Mentorship id #${mentorship._id}`
        );

        await this._mentorshipRepository.update(mentorshipId, mentorship);

        const currentUserId =
            mentorship.userId instanceof Types.ObjectId
                ? mentorship.userId.toString()
                : (mentorship.userId as unknown as UserEntity)?.id?.toString();
        await this._notificationService.createNotification(
            currentUserId as string,
            Role.User,
            NotificationType.MENTORSHIP_ACTIVE,
            NotificationMessages.MentorshipActiveTitle,
            `Your mentorship is now active until ${end.toLocaleDateString()}.`
        );

        const mentorIdForNotif =
            mentorship.mentorId instanceof Types.ObjectId
                ? mentorship.mentorId.toString()
                : (
                      mentorship.mentorId as unknown as MentorEntity
                  )?.id?.toString();
        if (mentorIdForNotif) {
            await this._notificationService.createNotification(
                mentorIdForNotif,
                Role.Mentor,
                NotificationType.MENTORSHIP_ACTIVE,
                NotificationMessages.MentorshipActiveTitle,
                `A new mentorship with user is now active.`,
                { mentorshipId }
            );
        }
        return mentorship;
    }

    async getActiveMentorship(userId: string): Promise<IMentorship | null> {
        return await this._mentorshipRepository.findActiveByUserId(userId);
    }

    async getMentorshipById(id: string): Promise<IMentorship | null> {
        return await this._mentorshipRepository.findById(id);
    }

    async bookSession(
        mentorshipId: string,
        userId: string,
        date: Date,
        slot: string
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);
        if (mentorship.userId.toString() !== userId)
            throw new Error(CommonMessages.Unauthorized);
        if (mentorship.status !== MentorshipStatus.ACTIVE)
            throw new Error(ErrorMessages.MentorshipNotActive);
        if (mentorship.usedSessions >= mentorship.totalSessions)
            throw new Error(ErrorMessages.NoSessionsRemaining);

        (mentorship.sessions as unknown as Types.DocumentArray<ISession>).push({
            date,
            slot,
            status: SessionStatus.BOOKED,
        });
        mentorship.usedSessions += 1;

        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }

    async rescheduleSession(
        mentorshipId: string,
        sessionId: string,
        newDate: Date,
        newSlot: string
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);

        const session = (
            mentorship.sessions as unknown as Types.DocumentArray<ISession>
        ).id(sessionId);
        if (!session) throw new Error(ErrorMessages.SessionNotFound);

        const now = new Date();
        const hoursDiff =
            (session.date.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 6)
            throw new Error(ErrorMessages.RescheduleTimeLimitMentorship);

        session.date = newDate;
        session.slot = newSlot;
        session.status = SessionStatus.RESCHEDULE_REQUESTED;

        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }

    async completeMentorship(
        mentorshipId: string,
        role: 'user' | 'mentor'
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);

        if (role === 'user') mentorship.userConfirmedCompletion = true;
        if (role === 'mentor') mentorship.mentorConfirmedCompletion = true;

        if (
            mentorship.userConfirmedCompletion &&
            mentorship.mentorConfirmedCompletion
        ) {
            mentorship.status = MentorshipStatus.COMPLETED;
            mentorship.completionInitiatedAt = undefined;
            await this.checkAndReleaseFunds(mentorship);

            const userIdForNotif =
                mentorship.userId instanceof Types.ObjectId
                    ? mentorship.userId.toString()
                    : (
                          mentorship.userId as unknown as MentorEntity
                      )?.id?.toString();
            if (userIdForNotif) {
                await this._notificationService.createNotification(
                    userIdForNotif,
                    Role.User,
                    NotificationType.MENTORSHIP_COMPLETED,
                    NotificationMessages.MentorshipCompletedTitle,
                    'Your mentorship has been marked as completed. Please provide feedback.',
                    { mentorshipId }
                );
            }

            const mentorIdForNotif =
                mentorship.mentorId instanceof Types.ObjectId
                    ? mentorship.mentorId.toString()
                    : (
                          mentorship.mentorId as unknown as MentorEntity
                      )?.id?.toString();
            if (mentorIdForNotif) {
                await this._notificationService.createNotification(
                    mentorIdForNotif,
                    Role.Mentor,
                    NotificationType.MENTORSHIP_COMPLETED,
                    NotificationMessages.MentorshipCompletedTitle,
                    'Your mentorship has been marked as completed.',
                    { mentorshipId }
                );
            }
        } else {
            if (!mentorship.completionInitiatedAt) {
                mentorship.completionInitiatedAt = new Date();
            }
        }

        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }

    async runDailyCompletionCheck(): Promise<void> {
        const today = new Date();
        const activeMentorships =
            await this._mentorshipRepository.findActiveMentorshipsForCompletionCheck();
        for (const mentorship of activeMentorships) {
            const endDate = mentorship.endDate
                ? new Date(mentorship.endDate)
                : null;
            if (!endDate) continue;

            const timeDiff = today.getTime() - endDate.getTime();
            const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));

            const userEmail = (mentorship.userId as unknown as UserEntity)
                ?.email;
            const mentorEmail = (mentorship.mentorId as unknown as MentorEntity)
                ?.email;

            if (
                daysPassed === 0 ||
                (daysPassed > 0 &&
                    daysPassed < 7 &&
                    !mentorship.completionInitiatedAt)
            ) {
                await this._notificationService.createNotification(
                    userEmail,
                    Role.User,
                    NotificationType.MENTORSHIP_COMPLETED,
                    'Mentorship Period Concluded',
                    "Your 30-day mentorship has completed! Please confirm completion on your dashboard so we can unlock your mentor's payout.",
                    { mentorshipId: mentorship._id }
                );

                await this._notificationService.createNotification(
                    mentorEmail,
                    Role.Mentor,
                    NotificationType.MENTORSHIP_COMPLETED,
                    'Mentorship Period Concluded',
                    'Your 30-day mentorship guidance has completed! Please request completion on your dashboard to unlock your payout.',
                    { mentorshipId: mentorship._id }
                );

                if (userEmail) {
                    await this._otpService.sendEmail(
                        userEmail,
                        'Confirm your Mentorship Completion - Efficacy',
                        `Hi there,\n\nYour 30-day guidance period has concluded! Please log in to Efficacy and confirm your completion so we can release your mentor's payout.`
                    );
                }
                if (mentorEmail) {
                    await this._otpService.sendEmail(
                        mentorEmail,
                        'Mentorship Session Concluded - Efficacy',
                        `Hi,\n\nYour 30-day guidance period has concluded! Please log in and request completion on your dashboard so we can clear your available balance.`
                    );
                }
            }

            if (mentorship.completionInitiatedAt) {
                const initiatedDate = new Date(
                    mentorship.completionInitiatedAt
                );
                const initiatedDiff = today.getTime() - initiatedDate.getTime();
                const initiatedDaysPassed = Math.floor(
                    initiatedDiff / (1000 * 3600 * 24)
                );

                if (initiatedDaysPassed >= 2) {
                    mentorship.status = MentorshipStatus.COMPLETED;
                    mentorship.userConfirmedCompletion = true;
                    mentorship.mentorConfirmedCompletion = true;
                    await this.checkAndReleaseFunds(mentorship);
                    await this._mentorshipRepository.update(
                        mentorship.id as string,
                        mentorship
                    );
                    continue;
                }
            }

            if (daysPassed >= 7) {
                mentorship.status = MentorshipStatus.COMPLETED;
                mentorship.userConfirmedCompletion = true;
                mentorship.mentorConfirmedCompletion = true;
                await this.checkAndReleaseFunds(mentorship);
                await this._mentorshipRepository.update(
                    mentorship.id as string,
                    mentorship
                );
            }
        }
    }

    async submitFeedback(
        mentorshipId: string,
        role: 'user' | 'mentor',
        rating: number,
        comment: string
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);

        if (role === 'user') {
            mentorship.userFeedback = { rating, comment };
        } else {
            mentorship.mentorFeedback = { rating, comment };
        }

        await this.checkAndReleaseFunds(mentorship);

        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }

    async cancelMentorship(
        mentorshipId: string,
        userId: string
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);

        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);

        const mentorshipUserId =
            (mentorship.userId as unknown as MentorEntity).id?.toString() ||
            mentorship.userId.toString();
        if (mentorshipUserId !== userId)
            throw new Error(CommonMessages.Unauthorized);
        if (mentorship.status !== MentorshipStatus.ACTIVE)
            throw new Error(ErrorMessages.CancelOnlyActive);

        const startDate = mentorship.startDate || new Date();
        const diffDays =
            (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24);

        if (diffDays > 7) throw new Error(ErrorMessages.CancellationExpired);

        const usedSessions = mentorship.usedSessions;

        if (usedSessions > 2)
            throw new Error(MentorshipMessages.SessionsExceeded);

        let refundAmount = 0;
        if (usedSessions === 0) {
            refundAmount = mentorship.amount;
        } else {
            const deduction = usedSessions * 300;
            refundAmount = Math.max(0, mentorship.amount - deduction);
        }

        const originalAdminShare = mentorship.amount * 0.1;
        const originalMentorShare = mentorship.amount * 0.9;

        const retainedAmount = mentorship.amount - refundAmount;
        const retainedAdminShare = retainedAmount * 0.1;
        const retainedMentorShare = retainedAmount * 0.9;

        await this._adminRepository.addRevenue(
            retainedAdminShare - originalAdminShare
        );

        const currentMentorId =
            mentorship.mentorId instanceof Types.ObjectId
                ? mentorship.mentorId.toString()
                : (
                      mentorship.mentorId as unknown as MentorEntity
                  ).id?.toString();

        const debitAmount = originalMentorShare - retainedMentorShare;

        if (debitAmount > 0 && currentMentorId) {
            await this._walletRepository.debitPendingBalance(
                currentMentorId,
                debitAmount
            );
        }

        if (retainedMentorShare > 0 && currentMentorId) {
            await this._walletRepository.releasePendingBalance(
                currentMentorId,
                retainedMentorShare
            );
        }

        if (!mentorship.paymentId) {
            throw new Error('No Stripe session ID found for this mentorship.');
        }
        const session = await this._stripe.checkout.sessions.retrieve(
            mentorship.paymentId
        );

        const paymentIntentId = session.payment_intent as string;

        if (!paymentIntentId) {
            throw new Error('No Payment Intent found for this Stripe session.');
        }

        const refund = await this._stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: Math.round(refundAmount * 100),
            reason: 'requested_by_customer',
        });

        if (refund) {
            mentorship.status = MentorshipStatus.CANCELLED;
            await this._mentorshipRepository.update(mentorshipId, mentorship);

            await this._notificationService.createNotification(
                userId,
                Role.User,
                NotificationType.MENTORSHIP_CANCELLED,
                NotificationMessages.MentorshipCancelledTitle,
                `Mentorship cancelled successfully. A refund of ₹${refundAmount} has been initiated to your original payment method and will appear in 3-5 business days.`,
                { mentorshipId }
            );

            return mentorship;
        } else {
            throw new Error(MentorshipMessages.FailedToRefund);
        }
    }

    private async checkAndReleaseFunds(mentorship: IMentorship): Promise<void> {
        if (
            mentorship.status === MentorshipStatus.COMPLETED &&
            mentorship.paymentStatus === PaymentStatus.VERIFIED
        ) {
            const mentorShare = mentorship.amount * 0.9;
            const currentMentorId =
                mentorship.mentorId instanceof Types.ObjectId
                    ? mentorship.mentorId.toString()
                    : (mentorship.mentorId as unknown as MentorEntity).id
                      ? (
                            mentorship.mentorId as unknown as MentorEntity
                        ).id.toString()
                      : (
                            mentorship.mentorId as unknown as MentorEntity
                        ).id?.toString();
            if (currentMentorId) {
                await this._walletRepository.releasePendingBalance(
                    currentMentorId,
                    mentorShare
                );
            }
            mentorship.paymentStatus = PaymentStatus.PAID;
        }
    }

    async findByUserIdAndMentorId(
        mentorId: string | ObjectId,
        userId: string | ObjectId
    ): Promise<IMentorship | null> {
        return await this._mentorshipRepository.findByUserIdAndMentorId(
            mentorId,
            userId
        );
    }
}
