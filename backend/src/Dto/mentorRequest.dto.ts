import { Role } from '@/types/role.types';

export class MentorRegisterRequestDto {
    constructor(
        public email: string,
        public password: string,
        public name: string,
        public role: Role.Mentor
    ) {}
}

export class MentorOtpVerificationRequestDto{
    constructor(
        public readonly email : string,
        public readonly otp :string,
    ){}
}

