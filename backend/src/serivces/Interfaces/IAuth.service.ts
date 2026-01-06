import { Role } from '@/types/role.types';
import { IMentor } from '@/models/Mentor.model';
import {
    ForgotPasswordRequestDto,
    LoginRequestDto,
    OtpVerificationRequestDto,
    ProfilePicUpdateDto,
    ProfileRequestDto,
    RegisterRequestDto,
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
    UpdateMentorProfileDto,
} from '@/Dto/mentorRequest.dto';
import {
    MentorOtpVerificationResponseDto,
    MentorRegisterInitResponseDto,
} from '@/Dto/mentorResponse.dto';

export interface IAuthService {
    updateUserProfile(
        data: ProfileRequestDto,
        id: string
    ): Promise<ProfileResponseDto>;
    updateUserProfilePic(
        data: ProfilePicUpdateDto
    ): Promise<ProfileResponseDto>;

    login(loginDto: LoginRequestDto): Promise<LoginResponseDTO>;

    registerInit(dto: RegisterRequestDto): Promise<RegisterInitResponseDto>;

    registerVerify(
        dto: OtpVerificationRequestDto
    ): Promise<OtpVerificationResponseDto>;

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
    ): Promise<MentorOtpVerificationResponseDto>;

    mentorLogin(dto: LoginRequestDto): Promise<LoginResponseDTO>;
    getMentorProfile(id: string): Promise<IMentor>;
    updateMentorProfileBasicInfo(id: string, data: UpdateMentorProfileDto): Promise<IMentor>;
    updateMentorProfileMedia(id: string, files: any): Promise<IMentor>;
    updateMentorProfileArray(id: string, field: string, data: any[]): Promise<IMentor>;
    getApprovedMentors(
        page: number,
        limit: number,
        search: string,
        sort: string,
        filter: any
    ): Promise<{ mentors: IMentor[]; total: number; pages: number }>;
    logout(refreshToken: string): Promise<void>;

    mentorLoginWithGoogle(
        dto: userGoogleLoginRequestDto
    ): Promise<userGoogleLoginResponseDto>;

    mentorResendOtp(dto: resendOtpRequestDto): Promise<MentorRegisterInitResponseDto>;
    mentorForgotPassword(dto: ForgotPasswordRequestDto): Promise<{ message: string }>;
    mentorResetPassword(dto: ResetPasswordrequestDto): Promise<{ message: string }>;

}
