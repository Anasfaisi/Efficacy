import { Role } from '@/types/role.types';

export class MentorRegisterRequestDto {
    constructor(
        public email: string,
        public password: string,
        public name: string,
        public role: Role.Mentor
    ) {}
}

export class MentorOtpVerificationRequestDto {
    constructor(
        public readonly email: string,
        public readonly otp: string
    ) {}
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

    qualification?: string;
    domain?: string;
    university?: string;
    graduationYear?: string;
    expertise?: string;
    academicSpan?: string;

    industryCategory?: string;
    experienceYears?: string;
    currentRole?: string;
    skills?: string;
    guidanceAreas?: string[];
    experienceSummary?: string;

    resume?: string;
    certificate?: string;
    idProof?: string;
}

export class UpdateMentorProfileDto {
    constructor(
        public name?: string,
        public phone?: string,
        public city?: string,
        public state?: string,
        public country?: string,
        public bio?: string,
        public linkedin?: string,
        public github?: string,
        public personalWebsite?: string,
        public demoVideoLink?: string,
        public mentorType?: 'Academic' | 'Industry',
        public qualification?: string,
        public domain?: string,
        public university?: string,
        public graduationYear?: string,
        public expertise?: string,
        public academicSpan?: string,
        public industryCategory?: string,
        public experienceYears?: string,
        public currentRole?: string,
        public skills?: string,
        public monthlyCharge?: number,
        public currentPassword?: string,
        public newPassword?: string
    ) {}
}
