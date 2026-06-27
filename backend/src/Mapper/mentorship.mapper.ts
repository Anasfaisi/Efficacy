import { IMentorship } from '@/models/mentorship.model';
import { MentorshipEntity } from '@/entity/mentorship.entity';
import { extractId } from '@/utils/extractId';

export class MentorShipMapper {
    static toEntity(doc: IMentorship): MentorshipEntity {
        return {
            id: doc.id,
            userId: doc.userId,
            mentorId: doc.mentorId,
            proposedStartDate: doc.proposedStartDate,
            status: doc.status,
            amount: doc.amount,
            paymentStatus: doc.paymentStatus,
            paymentId: doc.paymentId,
            usedSessions: doc.usedSessions,
            totalSessions: doc.totalSessions,
            userConfirmedCompletion: doc.userConfirmedCompletion,
            mentorConfirmedCompletion: doc.mentorConfirmedCompletion,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    static toPersistence(entity: MentorshipEntity): Partial<IMentorship> {
        return {
            id: entity.id,
            userId: extractId(
                entity.userId
            ) as unknown as import('mongoose').ObjectId,
            mentorId: extractId(
                entity.mentorId
            ) as unknown as import('mongoose').ObjectId,
            proposedStartDate: entity.proposedStartDate,
            status: entity.status,
            amount: entity.amount,
            paymentStatus: entity.paymentStatus,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
