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
        return await Mentorship.find({ userId }).populate(
            'mentorId',
            'name profilePic expertise'
        );
    }

    async findByMentorId(mentorId: string | ObjectId): Promise<IMentorship[]> {
        return await Mentorship.find({ mentorId }).populate(
            'userId',
            'name profilePic email'
        );
    }

    async findActiveByUserId(
        userId: string | ObjectId
    ): Promise<IMentorship | null> {
        return await Mentorship.findOne({
            userId,
            status: MentorshipStatus.ACTIVE,
        }).populate('mentorId', 'name profilePic expertise');
    }

    async findActiveByMentorId(
        mentorId: string | ObjectId
    ): Promise<IMentorship[]> {
        return await Mentorship.find({
            mentorId,
            status: MentorshipStatus.ACTIVE,
        }).populate('userId', 'name profilePic email');
    }
}
