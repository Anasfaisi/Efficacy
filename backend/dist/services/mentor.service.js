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
exports.MentorService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let MentorService = class MentorService {
    _mentorRepository;
    _passwordService;
    constructor(_mentorRepository, _passwordService) {
        this._mentorRepository = _mentorRepository;
        this._passwordService = _passwordService;
    }
    async getMentorProfile(id) {
        const mentor = await this._mentorRepository.findById(id);
        if (!mentor)
            throw new Error(response_messages_types_1.ErrorMessages.MentorNotFound);
        return mentor;
    }
    async updateMentorProfileBasicInfo(id, data) {
        const updateData = { ...data };
        if (updateData.newPassword && updateData.currentPassword) {
            const mentor = await this._mentorRepository.findById(id);
            if (!mentor || !mentor.password)
                throw new Error(response_messages_types_1.ErrorMessages.UserNotFound);
            const isMatch = await this._passwordService.verifyPassword(updateData.currentPassword, mentor.password);
            if (!isMatch)
                throw new Error(response_messages_types_1.ErrorMessages.IncorrectPassword);
            updateData.password = await this._passwordService.hashPassword(updateData.newPassword);
        }
        delete updateData.currentPassword;
        delete updateData.newPassword;
        const updatedMentor = await this._mentorRepository.update(id, updateData);
        if (!updatedMentor)
            throw new Error(response_messages_types_1.ErrorMessages.UpdateFailed);
        return updatedMentor;
    }
    async updateMentorProfileMedia(id, files) {
        const updateData = {};
        if (files.profilePic) {
            updateData.profilePic = `${files.profilePic[0].location}`;
        }
        if (files.coverPic) {
            updateData.coverPic = `${files.coverPic[0].location}`;
        }
        if (files.resume) {
            updateData.resume = `${files.resume[0].location}`;
        }
        if (files.certificate) {
            updateData.certificate = `${files.certificate[0].location}`;
        }
        if (files.idProof) {
            updateData.idProof = `${files.idProof[0].location}`;
        }
        const updated = await this._mentorRepository.update(id, updateData);
        if (!updated)
            throw new Error(response_messages_types_1.ErrorMessages.UpdateFailed);
        return updated;
    }
    async updateMentorProfileArray(id, field, data) {
        const updateData = {};
        updateData[field] = data;
        const updated = await this._mentorRepository.update(id, updateData);
        if (!updated)
            throw new Error(response_messages_types_1.ErrorMessages.UpdateFailed);
        return updated;
    }
    async getApprovedMentors(page, limit, search, sort, filter) {
        const mentorsList = await this._mentorRepository.findAllApprovedMentors(page, limit, search, sort, filter);
        return mentorsList;
    }
    async getMentorById(id) {
        return await this._mentorRepository.findById(id);
    }
};
exports.MentorService = MentorService;
exports.MentorService = MentorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PasswordService)),
    __metadata("design:paramtypes", [Object, Object])
], MentorService);
//# sourceMappingURL=mentor.service.js.map