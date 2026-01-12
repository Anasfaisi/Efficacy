import { IUser } from '@/models/User.model';
import { ColumnId } from '@/types/column-enum.types';
import { MessageStatus, Role } from '@/types/role.types';

//Login
export class LoginRequestDto {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly role: Role,
        public readonly name?: string
    ) {}
}

export class userGoogleLoginRequestDto {
    constructor(
        public readonly googleToken: string,
        public readonly role: Role
    ) {}
}

//Register
export class RegisterRequestDto {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly role: Role
    ) {}
}

//otp verification
export class OtpVerificationRequestDto {
    constructor(
        public readonly email: string,
        public readonly otp: string
    ) {}
}

//resend otp
export class resendOtpRequestDto {
    constructor(public readonly email: string) {}
}

//forget password
export class ForgotPasswordRequestDto {
    public email: string;
    constructor(email: string) {
        this.email = email;
    }
}

//reset password
export class ResetPasswordrequestDto {
    constructor(
        public readonly token: string,
        public readonly newPassword: string
    ) {}
}

//refreshing access token
export class RefreshRequestDto {}

//stripe checkout dto
export class CreateCheckoutDto {
    constructor(
        public readonly priceId: string,
        public readonly success_url: string,
        public readonly cancel_url: string,
        public readonly customerEmail?: string
    ) {
        if (!priceId) throw new Error('priceId is required');
    }
}

//request payment dto
export class RequestPaymentDto {
    constructor(
        public readonly userId: string,
        public readonly priceId: string,
        public readonly successUrl: string,
        public readonly cancelUrl: string
    ) {}
}

// DTO forincoming messages
export class SendMessageDto {
    constructor(
        public readonly roomId: string,
        public readonly senderId: string,
        public readonly senderName: string,
        public readonly message: string,
        public readonly createdAt: Date = new Date()
    ) {}
}

//DTO for joining Room
export class JoinRoomDto {
    constructor(
        public readonly roomId: string,
        public readonly user: IUser
    ) {}
}

export class CurrentUserReqDto {
    constructor(public readonly id: string) {}
}

/*============================  Message  ===================================*/
export class CreateMessageDTO {
    constructor(
        readonly conversationId: string,
        readonly senderId: string,
        readonly content: string,
        readonly attachments?: string[]
    ) {}
}

export class CreateChatDTO {
    constructor(
        readonly userA: string,
        readonly userB: string
    ) {}
}

//============================  user profile ==========================//
export class ProfileRequestDto {
    constructor(
        public name?: string,
        public userId?: string,
        public email?: string,
        public password?: string,
        public role: Role = Role.User,
        public bio?: string,
        public headline?: string,
        public profilePic?: string,
        public dob?: string,
        public subscription?: string,
        public xpPoints?: number,
        public badge?: string,
        public currentPassword?: string,
        public newPassword?: string
    ) {}
}

export class ProfilePicUpdateDto {
    file: Express.Multer.File;
    id: string;

    constructor(file: Express.Multer.File, id: string) {
        this.file = file;
        this.id = id;
    }
}

//=============================  task  ============================================//
export class KanbanTaskRequestDto {
    constructor(
        public taskId: string,
        public title: string,
        public description?: string,
        public dueDate?: string,
        public approxTimeToFinish?: string
    ) {}
}

export class kanbanColumnRequestDto {
    constructor(
        public columnId: ColumnId,
        public title: string,
        public tasks: KanbanTaskRequestDto[] = []
    ) {}
}

export class KanbanBoard {
    constructor(public columns: kanbanColumnRequestDto[]) {}
}

export class GetKanbanBoardRequestDto {
    constructor(public id: string) {}
}

export class AddKanbanTaskRequestDto {
    constructor(
        public id: string,
        public columnId: string,
        public task: KanbanTaskRequestDto
    ) {}
}

export class updateKanbanTaskRequestDto {
    constructor(
        public id: string,
        public taskId: string,
        public columnId: string,
        public data: Partial<KanbanTaskRequestDto>
    ) {}
}

export class deleteKanbanTaskRequestDto {
    constructor(
        public id: string,
        public columnId: string,
        public taskId: string
    ) {}
}

export class reorderKanbanTaskRequestDto {
    constructor(
        public id: string,
        public taskId: string,
        public sourceColumnId: string,
        public destColumnId: string,
        public sourceTaskIndex: number,
        public destTaskIndex: number
    ) {}
}

export class UpdateUserStatusRequestDto {
    constructor(
        public userId: string,
        public isActive: boolean
    ) {}
}
