import {
    LoginRequestDto,
    ForgotPasswordRequestDto,
    ResetPasswordrequestDto,
    userGoogleLoginRequestDto,
    resendOtpRequestDto,
} from '@/Dto/request.dto';
import {
    MentorRegisterRequestDto,
    MentorOtpVerificationRequestDto,
} from '@/Dto/mentorRequest.dto';
import {
    MentorLoginResponseDTO,
    MentorRegisterInitResponseDto,
    MentorOtpVerificationResponseDto,
} from '@/Dto/mentorResponse.dto';
import { userGoogleLoginResponseDto } from '@/Dto/response.dto';

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
    logout(refreshToken: string): Promise<void>;
}
