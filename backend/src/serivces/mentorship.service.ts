import { injectable, inject } from 'inversify';
import { IMentorshipService } from './Interfaces/IMentorship.service';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorshipRepository } from '@/repositories/interfaces/IMentorship.repository';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { INotificationService } from './Interfaces/INotification.service';
import { IWalletRepository } from '@/repositories/interfaces/IWallet.repository';
import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { IAdmin } from '@/models/Admin.model';
import {
    IMentorship,
    MentorshipStatus,
    SessionStatus,
} from '@/models/Mentorship.model';
import { NotificationType } from '@/types/notification.enum';
import { Role } from '@/types/role.types';
import { ObjectId, Types } from 'mongoose';
import { IMentor } from '@/models/Mentor.model';
import { IUser } from '@/models/User.model';
import { PaginatedMentorshipResponseDto } from '@/Dto/mentorship.dto';
import { ErrorMessages, SuccessMessages, AuthMessages, CommonMessages, NotificationMessages } from '@/types/response-messages.types';

@injectable()
export class MentorshipService implements IMentorshipService {
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
        private _adminRepository: IAdminRepository<IAdmin>
    ) {}

    async createRequest(
        userId: string | ObjectId,
        mentorId: string | ObjectId,
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
            userId,
            mentorId,
            proposedStartDate,
            totalSessions: sessions,
            status: MentorshipStatus.PENDING,
            amount: mentor.monthlyCharge || 0,
            paymentStatus: 'pending',
            sessions: [],
        } );

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
            mentorships,
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
        console.log(mentorship.mentorId== mentorId,mentorship.mentorId.toString(),mentorId,"mentorshipId from mentorshipService");
        const currentMentorId = mentorship.mentorId instanceof Types.ObjectId ? mentorship.mentorId.toString() : (mentorship.mentorId as any)?._id?.toString();
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

        const recipientId = mentorship.userId instanceof Types.ObjectId ? mentorship.userId.toString() : (mentorship.userId as any)?._id?.toString();

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
        const mentorshipUserId = (mentorship.userId as any)._id?.toString() || mentorship.userId.toString();
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

        const mentorId = mentorship.mentorId instanceof Types.ObjectId ? mentorship.mentorId.toString() : (mentorship.mentorId as any)?._id?.toString();

        if (mentorId) {
            await this._notificationService.createNotification(
                mentorId,
                Role.Mentor,
                NotificationType.MENTORSHIP_RESPONSE,
                confirm ? NotificationMessages.MentorshipSuggestionAcceptedTitle : NotificationMessages.MentorshipCancelledTitle,
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
        mentorship.paymentStatus = 'verified';
        mentorship.status = MentorshipStatus.ACTIVE;

        const start = mentorship.startDate || new Date();
        const end = new Date(start);
        end.setDate(end.getDate() + 30);
        mentorship.startDate = start;
        mentorship.endDate = end;

        // Distribute Funds
        const adminShare = mentorship.amount * 0.1;
        const mentorShare = mentorship.amount * 0.9;

        const currentMentorId = mentorship.mentorId instanceof Types.ObjectId ? mentorship.mentorId.toString() : (mentorship.mentorId as any)?._id?.toString();
        await this._adminRepository.addRevenue(adminShare);
        await this._walletRepository.creditPendingBalance(
            currentMentorId as string,
            mentorShare,
            `Mentorship Payment for Mentorship id #${mentorship._id}`
        );

        await this._mentorshipRepository.update(mentorshipId, mentorship);

        const currentUserId = mentorship.userId instanceof Types.ObjectId ? mentorship.userId.toString() : (mentorship.userId as any)?._id?.toString();
        await this._notificationService.createNotification(
            currentUserId as string,
            Role.User,
            NotificationType.MENTORSHIP_ACTIVE,
            NotificationMessages.MentorshipActiveTitle,
            `Your mentorship is now active until ${end.toLocaleDateString()}.`
        );

        const mentorIdForNotif = mentorship.mentorId instanceof Types.ObjectId ? mentorship.mentorId.toString() : (mentorship.mentorId as any)?._id?.toString();
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

        (mentorship.sessions as unknown as Types.DocumentArray<any>).push({
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
            mentorship.sessions as unknown as Types.DocumentArray<any>
        ).id(sessionId);
        if (!session) throw new Error(ErrorMessages.SessionNotFound);

        const now = new Date();
        const hoursDiff =
            (session.date.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 6)
            throw new Error(
                ErrorMessages.RescheduleTimeLimitMentorship
            );

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

            await this.checkAndReleaseFunds(mentorship); // Helper called here

            const userIdForNotif = mentorship.userId instanceof Types.ObjectId ? mentorship.userId.toString() : (mentorship.userId as any)?._id?.toString();
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

            const mentorIdForNotif = mentorship.mentorId instanceof Types.ObjectId ? mentorship.mentorId.toString() : (mentorship.mentorId as any)?._id?.toString();
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
        }

        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
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

        await this.checkAndReleaseFunds(mentorship); // Helper called here

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
        const mentorshipUserId = (mentorship.userId as any)._id?.toString() || mentorship.userId.toString();
        if (mentorshipUserId !== userId)
            throw new Error(CommonMessages.Unauthorized);
        if (mentorship.status !== MentorshipStatus.ACTIVE)
            throw new Error(ErrorMessages.CancelOnlyActive);
        const startDate = mentorship.startDate || new Date();
        const diffDays =
            (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7)
            throw new Error(ErrorMessages.CancellationExpired);

        let refundAmount = 0;
        const usedSessions = mentorship.usedSessions;

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

        const currentMentorId = mentorship.mentorId instanceof Types.ObjectId ? mentorship.mentorId.toString() : (mentorship.mentorId as any)?._id?.toString();
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

        // Credit refund to User Wallet
        if (refundAmount > 0) {
            await this._walletRepository.creditBalance(
                userId,
                refundAmount,
                `Refund for Mentorship #${mentorshipId}`
            );
        }

        mentorship.status = MentorshipStatus.CANCELLED;
        await this._mentorshipRepository.update(mentorshipId, mentorship);

        return mentorship;
    }

    private async checkAndReleaseFunds(mentorship: IMentorship): Promise<void> {
        if (
            mentorship.status === MentorshipStatus.COMPLETED &&
            mentorship.userFeedback &&
            mentorship.mentorFeedback &&
            mentorship.paymentStatus === 'verified'
        ) {
            const mentorShare = mentorship.amount * 0.9;
            const currentMentorId = mentorship.mentorId instanceof Types.ObjectId ? mentorship.mentorId.toString() : (mentorship.mentorId as any)?._id?.toString();
            if (currentMentorId) {
                await this._walletRepository.releasePendingBalance(
                    currentMentorId,
                    mentorShare
                );
            }
            mentorship.paymentStatus = 'paid';
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
