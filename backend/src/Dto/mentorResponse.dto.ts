import { Role } from '@/types/role.types';

export class MentorLoginResponseDTO {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly user: {
            id: string;
            name: string;
            email: string;
            role: Role;
            status: string;
        }
    ) {}

    toJSON() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            user: this.user,
        };
    }
}

export class MentorRegisterInitResponseDto {
    constructor(
        public tempEmail: string,
        public role: string,
        public resendAvailableAt: Date
    ) {}
}

export class MentorOtpVerificationResponseDto {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly user: {
            id: string;
            name: string;
            email: string;
            role: string;
            status?: string;
        }
    ) {}
}

//===================   mentor onboarding process  ========================

export interface MentorApplicationResponseDto {
    id: string;
    _id: string;
    email: string;

    name: string;
    phone?: string;
    city: string;
    state: string;
    country: string;
    bio: string;
    createdAt?: string | Date;

    linkedin?: string;
    github?: string;
    personalWebsite?: string;
    demoVideoLink?: string;

    availableDays: string[];
    preferredTime: string[];

    mentorType: 'Academic' | 'Industry';
    status?: string;

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

    monthlyCharge?: number;
    achievements?: string[];
    extraSkills?: string[];
    rating?: number;
    reviewCount?: number;
    sessionsCompleted?: number;
}

export class PaginatedMentorResponseDto {
    constructor(
        public mentors: MentorApplicationResponseDto[],
        public totalCount: number,
        public totalPages: number,
        public currentPage: number
    ) {}
}

export class PaginatedMentorApplicationResponseDto {
    constructor(
        public applications: MentorApplicationResponseDto[],
        public totalCount: number,
        public totalPages: number,
        public currentPage: number
    ) {}
}
