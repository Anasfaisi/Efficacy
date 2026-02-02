import { IMentorship } from '@/models/Mentorship.model';
import { ObjectId } from 'mongoose';

export interface IMentorshipService {
    createRequest(
        userId: string | ObjectId,
        mentorId: string | ObjectId,
        sessions: number,
        proposedStartDate?: Date
    ): Promise<IMentorship>;
    getMentorRequests(mentorId: string | ObjectId): Promise<IMentorship[]>;
    getUserRequests(userId: string | ObjectId): Promise<IMentorship[]>;
    respondToRequest(
        mentorshipId: string,
        mentorId: string,
        status: 'mentor_accepted' | 'rejected',
        suggestedStartDate?: Date,
        reason?: string
    ): Promise<IMentorship>;
    confirmMentorSuggestion(
        mentorshipId: string,
        userId: string,
        confirm: boolean
    ): Promise<IMentorship>;
    verifyPayment(
        mentorshipId: string,
        paymentId: string
    ): Promise<IMentorship>;
    getActiveMentorship(userId: string): Promise<IMentorship | null>;
    getMentorshipById(id: string): Promise<IMentorship | null>;
    bookSession(
        mentorshipId: string,
        userId: string,
        date: Date,
        slot: string
    ): Promise<IMentorship>;
    rescheduleSession(
        mentorshipId: string,
        sessionId: string,
        newDate: Date,
        newSlot: string
    ): Promise<IMentorship>;
    completeMentorship(
        mentorshipId: string,
        role: 'user' | 'mentor'
    ): Promise<IMentorship>;
    submitFeedback(
        mentorshipId: string,
        role: 'user' | 'mentor',
        rating: number,
        comment: string
    ): Promise<IMentorship>;
    findByUserIdAndMentorId(
        mentorId: string | ObjectId,
        userId: string | ObjectId
    ): Promise<IMentorship | null>;
    cancelMentorship(
        mentorshipId: string,
        userId: string
    ): Promise<IMentorship>;
}
