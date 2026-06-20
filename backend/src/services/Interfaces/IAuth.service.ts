import {
    ForgotPasswordRequestDto,
    LoginRequestDto,
    OtpVerificationRequestDto,
    PasswordDto,
    ProfilePicUpdateDto,
    ProfileRequestDto,
    RegisterRequestDto,
    resendOtpRequestDto,
    ResetPasswordrequestDto,
    userGoogleLoginRequestDto,
} from '@/dto/request.dto';
import {
    LoginResponseDTO,
    OtpVerificationResponseDto,
    ProfileResponseDto,
    RegisterInitResponseDto,
    userGoogleLoginResponseDto,
} from '@/dto/response.dto';

export interface IAuthService {
    updateUserProfile(
        data: ProfileRequestDto,
        id: string
    ): Promise<ProfileResponseDto>;
    updateUserProfilePic(
        data: ProfilePicUpdateDto
    ): Promise<ProfileResponseDto>;
    updateUserPassword(data: PasswordDto, userId: string): Promise<void>;

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

    logout(refreshToken: string): Promise<void>;
}
