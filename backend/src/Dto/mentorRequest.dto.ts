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
    id: string;
    name: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    bio: string;

    linkedin: string;
    github?: string;
    personalWebsite?: string;
    demoVideoLink: string;

    availableDays: string[];
    preferredTime: string[];

    mentorType: 'Academic' | 'Industry';

    // Branch A: Academic
    qualification?: string;
    domain?: string;
    university?: string;
    graduationYear?: string;
    expertise?: string;
    academicSpan?: string;

    // Branch B: Industry
    industryCategory?: string;
    experienceYears?: string;
    currentRole?: string;
    skills?: string;
    guidanceAreas?: string[];
    experienceSummary?: string;

    // Optional files (if handled via this DTO or separately)
    resume?: string;
    certificate?: string;
    idProof?: string;
}
