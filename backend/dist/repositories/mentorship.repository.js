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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorshipRepository = void 0;
const inversify_1 = require("inversify");
const base_repository_1 = require("./base.repository");
const mentorship_model_1 = __importDefault(require("@/models/mentorship.model"));
const mongoose_1 = require("mongoose");
const mentorship_types_1 = require("@/types/mentorship.types");
let MentorshipRepository = class MentorshipRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(mentorship_model_1.default);
    }
    async findByUserId(userId) {
        return await this.model
            .find({ userId })
            .populate('mentorId', 'name profilePic expertise');
    }
    async findByMentorId(mentorId) {
        return await this.model
            .find({ mentorId })
            .populate('userId', 'name profilePic expertise availability preferredTime');
    }
    async findActiveByUserId(userId) {
        return await this.model
            .findOne({
            userId,
            status: {
                $in: [
                    mentorship_types_1.MentorshipStatus.PENDING,
                    mentorship_types_1.MentorshipStatus.MENTOR_ACCEPTED,
                    mentorship_types_1.MentorshipStatus.USER_CONFIRMED,
                    mentorship_types_1.MentorshipStatus.PAYMENT_PENDING,
                    mentorship_types_1.MentorshipStatus.ACTIVE,
                ],
            },
        })
            .sort({ createdAt: -1 })
            .populate('mentorId', 'name profilePic expertise availability preferredTime');
    }
    async findActiveByMentorId(mentorId) {
        return await this.model
            .find({
            mentorId,
            status: mentorship_types_1.MentorshipStatus.ACTIVE,
        })
            .populate('userId', 'name profilePic email');
    }
    async findByUserIdAndMentorId(mentorId, userId) {
        return await this.model.findOne({
            userId,
            mentorId,
            status: {
                $nin: [
                    mentorship_types_1.MentorshipStatus.COMPLETED,
                    mentorship_types_1.MentorshipStatus.REJECTED,
                    mentorship_types_1.MentorshipStatus.CANCELLED,
                ],
            },
        });
    }
    async findById(id) {
        return await this.model
            .findById(id)
            .populate('mentorId', 'name profilePic expertise availability preferredTime')
            .populate('userId', 'name profilePic email phone')
            .exec();
    }
    async findPaginatedByMentorId(mentorId, page, limit, status, search) {
        const match = {
            mentorId: new mongoose_1.Types.ObjectId(mentorId),
        };
        if (status && status !== 'all') {
            if (status === 'approved') {
                match.status = {
                    $in: [
                        mentorship_types_1.MentorshipStatus.MENTOR_ACCEPTED,
                        mentorship_types_1.MentorshipStatus.PAYMENT_PENDING,
                        mentorship_types_1.MentorshipStatus.ACTIVE,
                    ],
                };
            }
            else {
                match.status = status;
            }
        }
        const pipeline = [{ $match: match }];
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
        const mentorships = results.map((m) => ({
            ...m,
            userId: m.userDetails,
        }));
        return { mentorships, total };
    }
    async findActiveMentorshipsForCompletionCheck() {
        return await this.model
            .find({
            status: mentorship_types_1.MentorshipStatus.ACTIVE,
        })
            .populate('userId', 'name email')
            .populate('mentorId', 'name email')
            .exec();
    }
};
exports.MentorshipRepository = MentorshipRepository;
exports.MentorshipRepository = MentorshipRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], MentorshipRepository);
//# sourceMappingURL=mentorship.repository.js.map