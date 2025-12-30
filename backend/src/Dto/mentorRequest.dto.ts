import { Role } from '@/types/role.types';

export class MentorRegisterRequestDto {
    constructor(
        public email: string,
        public password: string,
        public name: string,
        public role: Role.Mentor
    ) { }
}

export class MentorOtpVerificationRequestDto {
    constructor(
        public readonly email: string,
        public readonly otp: string,
    ) { }
}

//===========================     mentor onboarding process    =====================================

// Mentor Onboarding Application DTO
export interface MentorApplicationRequestDto {

    id: string,
    name: string,
    phone: string,
    city: string,
    state: string,
    country: string,
    bio: string,
    publicProfile: string,

    qualification: string,
    university: string,
    graduationYear: string,

    experienceYears: string,
    skills: string,
    experienceSummary: string,

    availableDays: string,
    preferredTime: string,
    sessionsPerWeek: string,

    resume?: string,
    certificate?: string,
    idProof?: string
}

