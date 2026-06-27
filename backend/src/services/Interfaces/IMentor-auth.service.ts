import {
    LoginRequestDto,
    ForgotPasswordRequestDto,
    ResetPasswordrequestDto,
    userGoogleLoginRequestDto,
    resendOtpRequestDto,
} from '@/dto/request.dto';
import {
    MentorRegisterRequestDto,
    MentorOtpVerificationRequestDto,
} from '@/dto/mentorRequest.dto';
import {
    MentorLoginResponseDTO,
    MentorRegisterInitResponseDto,
    MentorOtpVerificationResponseDto,
} from '@/dto/mentorResponse.dto';
import { userGoogleLoginResponseDto } from '@/dto/response.dto';

export interface IMentorAuthService {
    mentorLogin(dto: LoginRequestDto): Promise<MentorLoginResponseDTO>;
    mentorRegisterInit(
        dto: MentorRegisterRequestDto
    ): Promise<MentorRegisterInitResponseDto>;
    mentorRegisterVerify(
        dto: MentorOtpVerificationRequestDto
    ): Promise<MentorOtpVerificationResponseDto>;
    mentorLoginWithGoogle(
        dto: userGoogleLoginRequestDto
    ): Promise<userGoogleLoginResponseDto>;
    mentorResendOtp(
        dto: resendOtpRequestDto
    ): Promise<MentorRegisterInitResponseDto>;
    mentorForgotPassword(
        dto: ForgotPasswordRequestDto
    ): Promise<{ message: string }>;
    mentorResetPassword(
        dto: ResetPasswordrequestDto
    ): Promise<{ message: string }>;
    logout(): Promise<void>;
}
