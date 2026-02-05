
import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import Mentorship, {
    IMentorship,
    MentorshipStatus,
} from '@/models/Mentorship.model';
import { IMentorshipRepository } from './interfaces/IMentorship.repository';
import { ObjectId, Types } from 'mongoose';

@injectable()
export class MentorshipRepository
    extends BaseRepository<IMentorship>
    implements IMentorshipRepository
{
    constructor() {
        super(Mentorship);
    }

    async findByUserId(userId: string | ObjectId): Promise<IMentorship[]> {
        return await this.model
            .find({ userId })
            .populate('mentorId', 'name profilePic expertise');
    }

    async findByMentorId(mentorId: string | ObjectId): Promise<IMentorship[]> {
        return await this.model
            .find({ mentorId })
            .populate('userId', 'name profilePic expertise availableDays preferredTime');
    }

    async findActiveByUserId(
        userId: string | ObjectId
    ): Promise<IMentorship | null> {
        return await this.model
            .findOne({
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
            .populate('mentorId', 'name profilePic expertise availableDays preferredTime');
    }

    async findActiveByMentorId(
        mentorId: string | ObjectId
    ): Promise<IMentorship[]> {
        return await this.model
            .find({
                mentorId,
                status: MentorshipStatus.ACTIVE,
            })
            .populate('userId', 'name profilePic email');
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

    async findById(id: string): Promise<IMentorship | null> {
        return await this.model
            .findById(id)
            .populate(
                'mentorId',
                'name profilePic expertise availableDays preferredTime'
            )
            .populate('userId', 'name profilePic email phone')
            .exec();
    }

    async findPaginatedByMentorId(
        mentorId: string | ObjectId,
        page: number,
        limit: number,
        status?: string,
        search?: string
    ): Promise<{ mentorships: IMentorship[]; total: number }> {
        const match: any = { mentorId: new Types.ObjectId(mentorId as string) };
        if (status && status !== 'all') {
            if (status === 'approved') {
                match.status = {
                    $in: [
                        MentorshipStatus.MENTOR_ACCEPTED,
                        MentorshipStatus.PAYMENT_PENDING,
                        MentorshipStatus.ACTIVE,
                    ],
                };
            } else {
                match.status = status;
            }
        }

        const pipeline: any[] = [{ $match: match }];

        pipeline.push({
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails',
            },
        });

        pipeline.push({ $unwind: '$userDetails' });

        if (search) {
            pipeline.push({
                $match: {
                    'userDetails.name': { $regex: search, $options: 'i' },
                },
            });
        }

        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = await this.model.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push({ $skip: (page - 1) * limit });
        pipeline.push({ $limit: limit });

        const results = await this.model.aggregate(pipeline);

        // Map back to expected structure (populating userId)
        const mentorships = results.map((m) => ({
            ...m,
            userId: m.userDetails,
        }));

        return { mentorships, total };
    }
}
