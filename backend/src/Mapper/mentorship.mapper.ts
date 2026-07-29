import { IMentorship } from '@/models/mentorship.model';
import { MentorshipEntity } from '@/entity/mentorship.entity';
import { extractId } from '@/utils/extractId';
import { Types } from 'mongoose';

export class MentorShipMapper {
    static toEntity(doc: IMentorship): MentorshipEntity {
        return {
            id: doc._id as string,
            userId: doc.userId,
            mentorId: doc.mentorId,
            proposedStartDate: doc.proposedStartDate,
            status: doc.status,
            amount: doc.amount,
            paymentStatus: doc.paymentStatus,
            paymentId: doc.paymentId,
            usedSessions: doc.usedSessions,
            totalSessions: doc.totalSessions,
            sessions: doc.sessions?.map((s) => ({
                id: s._id?.toString(),
                date: s.date,
                slot: s.slot,
                status: s.status,
                mentorNotes: s.mentorNotes,
                userNotes: s.userNotes,
                meetingLink: s.meetingLink,
            })),
            userConfirmedCompletion: doc.userConfirmedCompletion,
            mentorConfirmedCompletion: doc.mentorConfirmedCompletion,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    static toPersistence(entity: MentorshipEntity): Partial<IMentorship> {
        return {
            id: entity.id,
            userId: new Types.ObjectId(extractId(entity.userId)),
            mentorId: new Types.ObjectId(extractId(entity.mentorId)),
            proposedStartDate: entity.proposedStartDate,
            status: entity.status,
            amount: entity.amount,
            paymentStatus: entity.paymentStatus,
            sessions: entity.sessions?.map((s) => ({
                ...(s.id && { _id: new Types.ObjectId(s.id) }),
                date: s.date,
                slot: s.slot,
                status: s.status,
                mentorNotes: s.mentorNotes,
                userNotes: s.userNotes,
                meetingLink: s.meetingLink,
            })),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
