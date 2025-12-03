import { Role } from '@/types/role.types';

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
