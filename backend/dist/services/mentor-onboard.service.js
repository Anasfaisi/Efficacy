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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorOnboardService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const notification_enum_1 = require("@/types/notification.enum");
const response_messages_types_1 = require("@/types/response-messages.types");
const mentor_mapper_1 = require("@/Mapper/mentor.mapper");
let MentorOnboardService = class MentorOnboardService {
    _mentorRepository;
    _notificationService;
    constructor(_mentorRepository, _notificationService) {
        this._mentorRepository = _mentorRepository;
        this._notificationService = _notificationService;
    }
    async mentorApplicationInit(dto) {
        const mentor = await this._mentorRepository.findById(dto.id);
        if (!mentor) {
            throw new Error(response_messages_types_1.ErrorMessages.MentorNotFound);
        }
        const updateData = {
            name: dto.name,
            phone: dto.phone,
            city: dto.city,
            state: dto.state,
            country: dto.country,
            bio: dto.bio,
            status: 'pending',
            linkedin: dto.linkedin,
            github: dto.github,
            personalWebsite: dto.personalWebsite,
            demoVideoLink: dto.demoVideoLink,
            availability: dto.availability,
            mentorType: dto.mentorType,
            qualification: dto.qualification,
            domain: dto.domain,
            university: dto.university,
            graduationYear: dto.graduationYear,
            expertise: dto.expertise,
            academicSpan: dto.academicSpan,
            industryCategory: dto.industryCategory,
            experienceYears: dto.experienceYears,
            currentRole: dto.currentRole,
            skills: dto.skills,
            guidanceAreas: dto.guidanceAreas,
            experienceSummary: dto.experienceSummary,
            resume: dto.resume,
            certificate: dto.certificate,
            idProof: dto.idProof,
        };
        const updatedMentorDoc = await this._mentorRepository.update(mentor.id, updateData);
        if (!updatedMentorDoc) {
            throw new Error(response_messages_types_1.ErrorMessages.MentorUpdateFailed);
        }
        await this._notificationService
            .notifyAdmin(notification_enum_1.NotificationType.MENTOR_APPLICATION_SUBMITTED, response_messages_types_1.NotificationMessages.NewMentorAppTitle, `Mentor ${updatedMentorDoc.name} has submitted an application for review.`, {
            mentorId: updatedMentorDoc.id,
            link: `/admin/mentors/review/${updatedMentorDoc.id}`,
        })
            .catch((err) => console.error('Failed to send admin notification:', err));
        return {
            id: updatedMentorDoc.id,
            _id: updatedMentorDoc.id,
            email: updatedMentorDoc.email,
            name: updatedMentorDoc.name,
            phone: updatedMentorDoc.phone,
            city: updatedMentorDoc.city || '',
            state: updatedMentorDoc.state || '',
            country: updatedMentorDoc.country || '',
            bio: updatedMentorDoc.bio || '',
            createdAt: updatedMentorDoc.createdAt,
            status: updatedMentorDoc.status,
            linkedin: updatedMentorDoc.linkedin,
            github: updatedMentorDoc.github,
            personalWebsite: updatedMentorDoc.personalWebsite,
            demoVideoLink: updatedMentorDoc.demoVideoLink,
            availability: updatedMentorDoc.availability,
            mentorType: updatedMentorDoc.mentorType,
            qualification: updatedMentorDoc.qualification,
            domain: updatedMentorDoc.domain,
            university: updatedMentorDoc.university,
            graduationYear: updatedMentorDoc.graduationYear,
            expertise: updatedMentorDoc.expertise,
            academicSpan: updatedMentorDoc.academicSpan,
            industryCategory: updatedMentorDoc.industryCategory,
            experienceYears: updatedMentorDoc.experienceYears,
            currentRole: updatedMentorDoc.currentRole,
            skills: updatedMentorDoc.skills,
            guidanceAreas: updatedMentorDoc.guidanceAreas,
            experienceSummary: updatedMentorDoc.experienceSummary,
            resume: updatedMentorDoc.resume,
            certificate: updatedMentorDoc.certificate,
            idProof: updatedMentorDoc.idProof,
        };
    }
    async activateMentor(mentorId, monthlyCharge) {
        const mentor = await this._mentorRepository.findById(mentorId);
        if (!mentor) {
            throw new Error(response_messages_types_1.ErrorMessages.MentorNotFound);
        }
        if (mentor.status !== 'approved') {
            throw new Error(response_messages_types_1.ErrorMessages.MentorNotApproved);
        }
        const result = await this._mentorRepository.update(mentorId, {
            status: 'active',
            monthlyCharge,
        });
        return mentor_mapper_1.MentorMapper.toEntity(result);
    }
};
exports.MentorOnboardService = MentorOnboardService;
exports.MentorOnboardService = MentorOnboardService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationService)),
    __metadata("design:paramtypes", [Object, Object])
], MentorOnboardService);
//# sourceMappingURL=mentor-onboard.service.js.map