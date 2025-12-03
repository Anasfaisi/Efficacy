import { Role } from '@/types/role.types';
import {
    ForgotPasswordRequestDto,
    LoginRequestDto,
    ProfilePicUpdateDto,
    ProfileRequestDto,
    resendOtpRequestDto,
    ResetPasswordrequestDto,
    userGoogleLoginRequestDto,
} from '@/Dto/request.dto';
import {
    CurrentUserResDto,
    LoginResponseDTO,
    OtpVerificationResponseDto,
    ProfileResponseDto,
    RegisterInitResponseDto,
    userGoogleLoginResponseDto,
} from '@/Dto/response.dto';
import {
    MentorOtpVerificationRequestDto,
    MentorRegisterRequestDto,
    MentorRegisterResponseDto,
} from '@/Dto/mentorRequest.dto';
import { MentorRegisterInitResponseDto } from '@/Dto/mentorResponse.dto';

export interface IAuthService {
    updateUserProfile(
        data: ProfileRequestDto,
        id: string
    ): Promise<ProfileResponseDto>;
    updateUserProfilePic(
        data: ProfilePicUpdateDto
    ): Promise<ProfileResponseDto>;

    login(loginDto: LoginRequestDto): Promise<LoginResponseDTO>;

    registerInit(params: {
        email: string;
        password: string;
        name: string;
        role: Role;
    }): Promise<RegisterInitResponseDto>;

    registerVerify(
        email: string,
        otp: string
    ): Promise<OtpVerificationResponseDto>;

    getCurrentUser(id: string): Promise<CurrentUserResDto>;

    refreshToken(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string }>;

    userLoginWithGoogle(
        dto: userGoogleLoginRequestDto
    ): Promise<userGoogleLoginResponseDto>;

    resendOtp(dto: resendOtpRequestDto): Promise<RegisterInitResponseDto>;
    forgotPassword(dto: ForgotPasswordRequestDto): Promise<{ message: string }>;
    resetPassword(dto: ResetPasswordrequestDto): Promise<{ message: string }>;

    mentorRegisterInit(
        dto: MentorRegisterRequestDto
    ): Promise<MentorRegisterInitResponseDto>;
    mentorRegisterVerify(
        dto: MentorOtpVerificationRequestDto
    ): Promise<MentorRegisterResponseDto>;
}
