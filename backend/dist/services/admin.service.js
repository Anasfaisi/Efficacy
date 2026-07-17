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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const inversify_1 = require("inversify");
const mentorResponse_dto_1 = require("@/dto/mentorResponse.dto");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const notification_enum_1 = require("@/types/notification.enum");
const role_types_1 = require("@/types/role.types");
const response_dto_1 = require("@/dto/response.dto");
const response_messages_types_1 = require("@/types/response-messages.types");
const mentorship_model_1 = __importDefault(require("@/models/mentorship.model"));
const payment_types_1 = require("@/types/payment.types");
let AdminService = class AdminService {
    _mentorRepository;
    _notificationService;
    _userRepository;
    _walletRepository;
    _adminRepository;
    constructor(_mentorRepository, _notificationService, _userRepository, _walletRepository, _adminRepository) {
        this._mentorRepository = _mentorRepository;
        this._notificationService = _notificationService;
        this._userRepository = _userRepository;
        this._walletRepository = _walletRepository;
        this._adminRepository = _adminRepository;
    }
    mapToResponseDto(mentor) {
        return {
            id: mentor.id,
            _id: mentor.id,
            email: mentor.email,
            name: mentor.name,
            phone: mentor.phone,
            city: mentor.city || '',
            state: mentor.state || '',
            country: mentor.country || '',
            bio: mentor.bio || '',
            createdAt: mentor.createdAt,
            status: mentor.status,
            profilePic: mentor.profilePic,
            linkedin: mentor.linkedin,
            github: mentor.github,
            personalWebsite: mentor.personalWebsite,
            demoVideoLink: mentor.demoVideoLink,
            availability: mentor.availability,
            mentorType: mentor.mentorType,
            qualification: mentor.qualification,
            domain: mentor.domain,
            university: mentor.university,
            graduationYear: mentor.graduationYear,
            expertise: mentor.expertise,
            academicSpan: mentor.academicSpan,
            industryCategory: mentor.industryCategory,
            experienceYears: mentor.experienceYears,
            currentRole: mentor.currentRole,
            skills: mentor.skills,
            guidanceAreas: mentor.guidanceAreas,
            experienceSummary: mentor.experienceSummary,
            resume: mentor.resume,
            certificate: mentor.certificate,
            idProof: mentor.idProof,
        };
    }
    mapToUserManagementResponseDto(user) {
        return new response_dto_1.UserManagementResponseDto(user.id.toString(), user.name, user.email, user.role, user.isActive, user.profilePic, user.createdAt);
    }
    async getMentorApplications(page, limit, search, filters) {
        const { mentors, total } = await this._mentorRepository.getMentorApplications(page, limit, search, filters);
        const mappedApplications = mentors.map((m) => this.mapToResponseDto(m));
        return new mentorResponse_dto_1.PaginatedMentorApplicationResponseDto(mappedApplications, total, Math.ceil(total / limit), page);
    }
    async getMentorApplicationById(id) {
        const mentor = await this._mentorRepository.findById(id);
        return mentor ? this.mapToResponseDto(mentor) : null;
    }
    async approveMentorApplication(id) {
        const mentor = await this._mentorRepository.update(id, {
            status: 'approved',
            isVerified: true,
        });
        console.log(mentor, ' what is coming here ');
        if (mentor) {
            await this._notificationService.createNotification(mentor.id, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTOR_APPLICATION_APPROVED, response_messages_types_1.NotificationMessages.MentorAppApprovedTitle, 'Congratulations! Your mentor application has been approved. You can now access the mentor dashboard.', { link: '/mentor/dashboard' });
        }
    }
    async rejectMentorApplication(id, reason) {
        const mentor = await this._mentorRepository.update(id, {
            status: 'rejected',
            applicationFeedback: reason,
        });
        if (mentor) {
            await this._notificationService.createNotification(mentor.id, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTOR_APPLICATION_REJECTED, response_messages_types_1.NotificationMessages.MentorAppRejectedTitle, `Your mentor application has been rejected. Reason: ${reason}`, { reason });
        }
    }
    async requestChangesMentorApplication(id, reason) {
        const mentor = await this._mentorRepository.update(id, {
            status: 'reapply',
            applicationFeedback: reason,
        });
        if (mentor) {
            await this._notificationService.createNotification(mentor.id, role_types_1.Role.Mentor, notification_enum_1.NotificationType.SYSTEM_ANNOUNCEMENT, response_messages_types_1.NotificationMessages.ChangesRequestedTitle, `The admin has requested changes to your application. Reason: ${reason}`, { reason, link: '/mentor/onboarding' });
        }
    }
    async getAllMentors(page, limit, search, filters) {
        const { mentors, total } = await this._mentorRepository.getAllMentors(page, limit, search, filters);
        const mappedMentors = mentors.map((mentor) => this.mapToResponseDto(mentor));
        return new mentorResponse_dto_1.PaginatedMentorResponseDto(mappedMentors, total, Math.ceil(total / limit), page);
    }
    async getMentorById(id) {
        return this.getMentorApplicationById(id);
    }
    async updateMentorStatus(id, status) {
        await this._mentorRepository.update(id, { status });
    }
    async getAllUsers(page, limit, search) {
        const { users, totalCount } = await this._userRepository.getAllUsers(page, limit, search);
        const mappedUsers = users.map((user) => this.mapToUserManagementResponseDto(user));
        return new response_dto_1.PaginatedUserResponseDto(mappedUsers, totalCount, Math.ceil(totalCount / limit), page);
    }
    async updateUserStatus(dto) {
        await this._userRepository.updateUser(dto.userId, {
            isActive: dto.isActive,
        });
    }
    async getRevenueDetails(adminId) {
        const admin = await this._adminRepository.findById(adminId);
        return { totalRevenue: admin?.totalRevenue || 0 };
    }
    async getAllTransactions(page, limit, filter) {
        return await this._walletRepository.getGlobalTransactions(page, limit, filter);
    }
    async getDashboardStats(adminId) {
        const { totalCount: totalUsers } = await this._userRepository.getAllUsers(1, 1);
        const { total: totalMentors } = await this._mentorRepository.getAllMentors(1, 1);
        const { totalRevenue } = await this.getRevenueDetails(adminId);
        const { mentors } = await this._mentorRepository.findAllApprovedMentors(1, 5, '', 'sessionsCompleted_desc', {});
        const topMentors = mentors.map((m) => this.mapToResponseDto(m));
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        const revenueAggregation = await mentorship_model_1.default.aggregate([
            {
                $match: {
                    paymentStatus: {
                        $in: [payment_types_1.PaymentStatus.PAID, payment_types_1.PaymentStatus.VERIFIED],
                    },
                    updatedAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: { $month: '$updatedAt' },
                    revenue: { $sum: { $multiply: ['$amount', 0.1] } },
                },
            },
        ]);
        const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        const revenueData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthIndex = d.getMonth();
            const matchingData = revenueAggregation.find((r) => r._id === monthIndex + 1);
            revenueData.push({
                month: monthNames[monthIndex],
                revenue: matchingData ? matchingData.revenue : 0,
            });
        }
        return {
            totalUsers,
            totalMentors,
            totalRevenue,
            topMentors,
            revenueData,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationService)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserRepository)),
    __param(3, (0, inversify_1.inject)(inversify_key_types_1.TYPES.WalletRepository)),
    __param(4, (0, inversify_1.inject)(inversify_key_types_1.TYPES.AdminRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AdminService);
//# sourceMappingURL=admin.service.js.map