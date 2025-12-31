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
            status: string,


        }
    ) { }

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
    ) { }
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
    ) { }
}


//===================   mentor onboarding process  ========================

export interface MentorApplicationResponseDto {
    email: string;
    name: string;
    phone?: string;
    city: string;
    state: string;
    country: string;
    bio: string;

    linkedin?: string;
    github?: string;
    personalWebsite?: string;
    demoVideoLink?: string;

    availableDays: string[];
    preferredTime: string[];

    mentorType: 'Academic' | 'Industry';
    status?: string;

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

    resume?: string;
    certificate?: string;
    idProof?: string;
}
