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
exports.MentorRepository = void 0;
const inversify_1 = require("inversify");
const base_repository_1 = require("./base.repository");
const mentor_model_1 = __importDefault(require("@/models/mentor.model"));
let MentorRepository = class MentorRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(mentor_model_1.default);
    }
    async findByEmail(email) {
        return this.findOne({ email });
    }
    async createUser(data) {
        return this.create(data);
    }
    async getAllMentors(page, limit, search, filters) {
        const query = {
            status: { $in: ['active', 'inactive'] },
        };
        if (filters?.status && filters.status !== 'all') {
            query.status = filters.status;
        }
        if (filters?.mentorType && filters.mentorType !== 'all') {
            query.mentorType = filters.mentorType;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const total = await this.model.countDocuments(query);
        const mentors = await this.model
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return { mentors, total };
    }
    async getMentorApplications(page, limit, search, filters) {
        const query = { status: { $ne: 'incomplete' } };
        if (filters?.status && filters.status !== 'all') {
            query.status = filters.status;
        }
        if (filters?.mentorType && filters.mentorType !== 'all') {
            query.mentorType = filters.mentorType;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const total = await this.model.countDocuments(query);
        const mentors = await this.model
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return { mentors, total };
    }
    async findAllApprovedMentors(page, limit, search, sort, filter) {
        const query = { status: 'active' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { domain: { $regex: search, $options: 'i' } },
                { expertise: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } },
                { currentRole: { $regex: search, $options: 'i' } },
            ];
        }
        if (filter) {
            Object.assign(query, filter);
        }
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split('_');
            const sortField = field === 'price' ? 'monthlyCharge' : field;
            sortOptions[sortField] = order === 'asc' ? 1 : -1;
        }
        else {
            sortOptions.createdAt = -1;
        }
        const skip = (page - 1) * limit;
        const total = await this.model.countDocuments(query);
        const mentors = await this.model
            .find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();
        const pages = Math.ceil(total / limit);
        return { mentors, total, pages };
    }
};
exports.MentorRepository = MentorRepository;
exports.MentorRepository = MentorRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], MentorRepository);
//# sourceMappingURL=mentor.repository.js.map