import { Role } from '@/types/role.types';

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
    email: string,
    fullName: string,
    city: string,
    state: string,
    country: string,
    bio: string,
    publicProfile: string,

    highestQualification: string,
    university: string,
    graduationYear: string,

    experienceYears: string,
    skills: string,
    experienceSummary: string,

    availableDays: string,
    preferredTime: string,
    sessionsPerWeek: string,

    status?: string,

    resume?: string,
    certificate?: string,
    idProof?: string
}
