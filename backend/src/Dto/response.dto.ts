import { Role } from '@/types/role.types';

type subscription = {
    id?: string;
    status?: string;
    priceId?: string;
    current_period_end?: Date;
};
//login
export class LoginResponseDTO {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly user: {
            id: string;
            name: string;
            email: string;
            role: Role;
            subscription?: subscription;
            bio?: string;
            headline?: string;
            profilePic?: string;
            dob?: string;
            xpPoints?: number;
            badge?: string;
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

//Register
export class RegisterInitResponseDto {
    constructor(
        public readonly tempEmail: string,
        public readonly role: string
    ) {}
}

//otpverification
export class OtpVerificationResponseDto {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly user: {
            id: string;
            name: string;
            email: string;
            role?: Role;
            subscription?: subscription;
        }
    ) {}
}

//forget password
export class ForgotPasswordVerifyDto {
    constructor(
        public readonly email: string,
        public readonly otp: string,
        public readonly newPassword: string,
        public readonly tempUserId: string
    ) {}
}

//refreshing access token
export class RefreshResponseDto {
    constructor(public readonly success: string) {}
}

// export class SubscriptionResponseDTO {
//   constructor(
//     public readonly id: string,
//     public readonly status: string,
//     public readonly priceId: string,
//     public readonly currentPeriodEnd: Date,
//     public readonly user: {
//       id: string;
//       name: string;
//       email: string;
//     }
//   ) {}
// }

// Dto/responseDto/ResponsePayment.dto.ts
export class ResponsePaymentDto {
    constructor(
        public readonly sessionId: string,
        public readonly url: string
    ) {}
}

export class CurrentUserResDto {
    constructor(
        public readonly user: {
            id: string;
            name: string;
            email: string;
            role?: Role;
            subscription?: subscription;
        }
    ) {}
}

/* =======================  Message   ==========================*/

export class MessageResponseDto {
    constructor(
        public id: string,
        public conversationId: string,
        public senderId: string,
        public content: string,
        public attachments?: string[],
        public status?: string,
        public seenBy?: string[],
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}
}

export interface ChatResponseDTO {
    id: string;
    participants: string[];
    lastMessage?: string;
    isGroup: boolean;
    createdAt?: Date;
}

//======================  user profile  =========================//

export class ProfileResponseDto {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public role: Role,
        public subscription?: subscription,
        public bio?: string,
        public headline?: string,
        public profilePic?: string,
        public dob?: string,
        public xpPoints?: number,
        public badge?: string
    ) {}
}
