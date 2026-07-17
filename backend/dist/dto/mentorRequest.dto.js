"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMentorProfileDto = exports.MentorOtpVerificationRequestDto = exports.MentorRegisterRequestDto = void 0;
class MentorRegisterRequestDto {
    email;
    password;
    name;
    role;
    constructor(email, password, name, role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = role;
    }
}
exports.MentorRegisterRequestDto = MentorRegisterRequestDto;
class MentorOtpVerificationRequestDto {
    email;
    otp;
    constructor(email, otp) {
        this.email = email;
        this.otp = otp;
    }
}
exports.MentorOtpVerificationRequestDto = MentorOtpVerificationRequestDto;
class UpdateMentorProfileDto {
    name;
    phone;
    city;
    state;
    country;
    bio;
    linkedin;
    github;
    personalWebsite;
    demoVideoLink;
    mentorType;
    qualification;
    domain;
    university;
    graduationYear;
    expertise;
    academicSpan;
    industryCategory;
    experienceYears;
    currentRole;
    skills;
    monthlyCharge;
    currentPassword;
    newPassword;
    constructor(name, phone, city, state, country, bio, linkedin, github, personalWebsite, demoVideoLink, mentorType, qualification, domain, university, graduationYear, expertise, academicSpan, industryCategory, experienceYears, currentRole, skills, monthlyCharge, currentPassword, newPassword) {
        this.name = name;
        this.phone = phone;
        this.city = city;
        this.state = state;
        this.country = country;
        this.bio = bio;
        this.linkedin = linkedin;
        this.github = github;
        this.personalWebsite = personalWebsite;
        this.demoVideoLink = demoVideoLink;
        this.mentorType = mentorType;
        this.qualification = qualification;
        this.domain = domain;
        this.university = university;
        this.graduationYear = graduationYear;
        this.expertise = expertise;
        this.academicSpan = academicSpan;
        this.industryCategory = industryCategory;
        this.experienceYears = experienceYears;
        this.currentRole = currentRole;
        this.skills = skills;
        this.monthlyCharge = monthlyCharge;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }
}
exports.UpdateMentorProfileDto = UpdateMentorProfileDto;
//# sourceMappingURL=mentorRequest.dto.js.map