import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import Mentorship, {
    IMentorship,
    MentorshipStatus,
} from '@/models/Mentorship.model';
import { IMentorshipRepository } from './interfaces/IMentorship.repository';
import { ObjectId } from 'mongoose';

@injectable()
export class MentorshipRepository
    extends BaseRepository<IMentorship>
    implements IMentorshipRepository
{
    constructor() {
        super(Mentorship);
    }

    async findByUserId(userId: string | ObjectId): Promise<IMentorship[]> {
        return await this.model.find({ userId }).populate(
            'mentorId',
            'name profilePic expertise'
        );
    }

    async findByMentorId(mentorId: string | ObjectId): Promise<IMentorship[]> {
        return await this.model.find({ mentorId }).populate(
            'userId',
            'name profilePic email'
        );
    }

    async findActiveByUserId(
        userId: string | ObjectId
    ): Promise<IMentorship | null> {
        return await this.model.findOne({
            userId,
            status: {
                $in: [
                    MentorshipStatus.PENDING,
                    MentorshipStatus.MENTOR_ACCEPTED,
                    MentorshipStatus.USER_CONFIRMED,
                    MentorshipStatus.PAYMENT_PENDING,
                    MentorshipStatus.ACTIVE,
                ],
            },
        })
            .sort({ createdAt: -1 })
            .populate('mentorId', 'name profilePic expertise');
    }

    async findActiveByMentorId(
        mentorId: string | ObjectId
    ): Promise<IMentorship[]> {
        return await this.model.find({
            mentorId,
            status: MentorshipStatus.ACTIVE,
        }).populate('userId', 'name profilePic email');
    }

    async findByUserIdAndMentorId(
        mentorId: string | ObjectId,
        userId: string | ObjectId
    ): Promise<IMentorship | null> {
        return await this.model.findOne({
            userId,
            mentorId,
            status: {
                $nin: [
                    MentorshipStatus.COMPLETED,
                    MentorshipStatus.REJECTED,
                    MentorshipStatus.CANCELLED,
                ],
            },
        });
    }
}
