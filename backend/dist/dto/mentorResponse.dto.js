"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedMentorApplicationResponseDto = exports.PaginatedMentorResponseDto = exports.MentorOtpVerificationResponseDto = exports.MentorRegisterInitResponseDto = exports.MentorLoginResponseDTO = void 0;
class MentorLoginResponseDTO {
    accessToken;
    refreshToken;
    user;
    constructor(accessToken, refreshToken, user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
    toJSON() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            user: this.user,
        };
    }
}
exports.MentorLoginResponseDTO = MentorLoginResponseDTO;
class MentorRegisterInitResponseDto {
    tempEmail;
    role;
    resendAvailableAt;
    constructor(tempEmail, role, resendAvailableAt) {
        this.tempEmail = tempEmail;
        this.role = role;
        this.resendAvailableAt = resendAvailableAt;
    }
}
exports.MentorRegisterInitResponseDto = MentorRegisterInitResponseDto;
class MentorOtpVerificationResponseDto {
    accessToken;
    refreshToken;
    user;
    constructor(accessToken, refreshToken, user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}
exports.MentorOtpVerificationResponseDto = MentorOtpVerificationResponseDto;
class PaginatedMentorResponseDto {
    mentors;
    totalCount;
    totalPages;
    currentPage;
    constructor(mentors, totalCount, totalPages, currentPage) {
        this.mentors = mentors;
        this.totalCount = totalCount;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}
exports.PaginatedMentorResponseDto = PaginatedMentorResponseDto;
class PaginatedMentorApplicationResponseDto {
    applications;
    totalCount;
    totalPages;
    currentPage;
    constructor(applications, totalCount, totalPages, currentPage) {
        this.applications = applications;
        this.totalCount = totalCount;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}
exports.PaginatedMentorApplicationResponseDto = PaginatedMentorApplicationResponseDto;
//# sourceMappingURL=mentorResponse.dto.js.map