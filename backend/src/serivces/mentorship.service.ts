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
        const mentor = await this._mentorRepository.findById(
            mentorId as string
        );
        if (!mentor) throw new Error('Mentor not found');
        const existingMentorship =
            await this._mentorshipRepository.findByUserIdAndMentorId(
                mentorId,
                userId
            );
        if (existingMentorship)
            throw new Error(
                'You already have an ongoing mentorship request or active session with this mentor.'
            );
        const mentorship = await this._mentorshipRepository.create({
            userId,
            mentorId,
            proposedStartDate,
            totalSessions: sessions,
            status: MentorshipStatus.PENDING,
            amount: mentor.monthlyCharge || 0,
            paymentStatus: 'pending',
            sessions: [],
        } as any);

        await this._notificationService.createNotification(
            mentorId as string,
            Role.Mentor,
            NotificationType.MENTORSHIP_REQUEST,
            'New Mentorship Request',
            'A user has requested a 1-month mentorship with you.',
            { mentorshipId: mentorship._id }
        );

        return mentorship;
    }

    async getMentorRequests(
        mentorId: string | ObjectId
    ): Promise<IMentorship[]> {
        return await this._mentorshipRepository.findByMentorId(mentorId);
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
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error('Mentorship not found');
        if (mentorship.mentorId.toString() !== mentorId)
            throw new Error('Unauthorized');

        mentorship.status =
            status === 'mentor_accepted'
                ? MentorshipStatus.MENTOR_ACCEPTED
                : MentorshipStatus.REJECTED;
        if (suggestedStartDate)
            mentorship.mentorSuggestedStartDate = suggestedStartDate;
        if (reason) mentorship.rejectionReason = reason;

        await this._mentorshipRepository.update(mentorshipId, mentorship);

        await this._notificationService.createNotification(
            mentorship.userId.toString(),
            Role.User,
            NotificationType.MENTORSHIP_RESPONSE,
            status === 'mentor_accepted'
                ? 'Mentorship Request Accepted'
                : 'Mentorship Request Rejected',
            status === 'mentor_accepted'
                ? `Mentor has accepted your request${suggestedStartDate ? ' with a suggested start date' : ''}.`
                : `Mentor has rejected your request: ${reason}`,
            { mentorshipId, status, link: '/my-mentorships' }
        );

        return mentorship;
    }

    async confirmMentorSuggestion(
        mentorshipId: string,
        userId: string,
        confirm: boolean
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error('Mentorship not found');
        if (mentorship.userId.toString() !== userId)
            throw new Error('Unauthorized');

        if (confirm) {
            mentorship.status = MentorshipStatus.PAYMENT_PENDING;
            mentorship.startDate =
                mentorship.mentorSuggestedStartDate ||
                mentorship.proposedStartDate;
        } else {
            mentorship.status = MentorshipStatus.CANCELLED;
        }

        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }

    async verifyPayment(
        mentorshipId: string,
        paymentId: string
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error('Mentorship not found');

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

        await this._adminRepository.addRevenue(adminShare);
        await this._walletRepository.creditPendingBalance(
            mentorship.mentorId as unknown as string,
            mentorShare,
            `Mentorship Payment for Mentorship id #${mentorship._id}`
        );

        await this._mentorshipRepository.update(mentorshipId, mentorship);

        await this._notificationService.createNotification(
            mentorship.userId.toString(),
            Role.User,
            NotificationType.MENTORSHIP_ACTIVE,
            'Mentorship Active',
            `Your mentorship is now active until ${end.toLocaleDateString()}.`
        );

        await this._notificationService.createNotification(
            mentorship.mentorId.toString(),
            Role.Mentor,
            NotificationType.MENTORSHIP_ACTIVE,
            'Mentorship Active',
            `A new mentorship with user is now active.`,
            { mentorshipId }
        );

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
        date: Date
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error('Mentorship not found');
        if (mentorship.userId.toString() !== userId)
            throw new Error('Unauthorized');
        if (mentorship.status !== MentorshipStatus.ACTIVE)
            throw new Error('Mentorship is not active');
        if (mentorship.usedSessions >= mentorship.totalSessions)
            throw new Error('No sessions remaining');

        (mentorship.sessions as unknown as Types.DocumentArray<any>).push({
            date,
            status: SessionStatus.BOOKED,
        });
        mentorship.usedSessions += 1;

        await this._mentorshipRepository.update(mentorshipId, mentorship);
        return mentorship;
    }

    async rescheduleSession(
        mentorshipId: string,
        sessionId: string,
        newDate: Date
    ): Promise<IMentorship> {
        const mentorship =
            await this._mentorshipRepository.findById(mentorshipId);
        if (!mentorship) throw new Error('Mentorship not found');

        const session = (
            mentorship.sessions as unknown as Types.DocumentArray<any>
        ).id(sessionId);
        if (!session) throw new Error('Session not found');

        const now = new Date();
        const hoursDiff =
            (session.date.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 6)
            throw new Error(
                'Rescheduling must be done at least 6 hours in advance'
            );

        session.date = newDate;
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
        if (!mentorship) throw new Error('Mentorship not found');

        if (role === 'user') mentorship.userConfirmedCompletion = true;
        if (role === 'mentor') mentorship.mentorConfirmedCompletion = true;

        if (
            mentorship.userConfirmedCompletion &&
            mentorship.mentorConfirmedCompletion
        ) {
            mentorship.status = MentorshipStatus.COMPLETED;

            await this.checkAndReleaseFunds(mentorship); // Helper called here

            await this._notificationService.createNotification(
                mentorship.userId.toString(),
                Role.User,
                NotificationType.MENTORSHIP_COMPLETED,
                'Mentorship Completed',
                'Your mentorship has been marked as completed. Please provide feedback.',
                { mentorshipId }
            );

            await this._notificationService.createNotification(
                mentorship.mentorId.toString(),
                Role.Mentor,
                NotificationType.MENTORSHIP_COMPLETED,
                'Mentorship Completed',
                'Your mentorship has been marked as completed.',
                { mentorshipId }
            );
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
        if (!mentorship) throw new Error('Mentorship not found');

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
        if (!mentorship) throw new Error('Mentorship not found');
        if (mentorship.userId.toString() !== userId)
            throw new Error('Unauthorized');
        if (mentorship.status !== MentorshipStatus.ACTIVE)
            throw new Error('Can only cancel active mentorships');

        const startDate = mentorship.startDate || new Date();
        const diffDays =
            (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7)
            throw new Error('Cancellation period (7 days) has expired');

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

        const debitAmount = originalMentorShare - retainedMentorShare;
        if (debitAmount > 0) {
            await this._walletRepository.debitPendingBalance(
                mentorship.mentorId as unknown as string,
                debitAmount
            );
        }
        if (retainedMentorShare > 0) {
            await this._walletRepository.releasePendingBalance(
                mentorship.mentorId as unknown as string,
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
            await this._walletRepository.releasePendingBalance(
                mentorship.mentorId as unknown as string,
                mentorShare
            );
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
