import { Role } from '@/types/role.types';
import {
    ForgotPasswordRequestDto,
    LoginRequestDto,
    ProfilePicUpdateDto,
    ProfileRequestDto,
    resendOtpRequestDto,
    ResetPasswordrequestDto,
} from '@/Dto/request.dto';
import {
    CurrentUserResDto,
    LoginResponseDTO,
    ProfileResponseDto,
    RegisterInitResponseDto,
} from '@/Dto/response.dto';

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
    ): Promise<{
        accessToken: string;
        refreshToken: string;
        user: { id: string; email: string; name: string; role: string };
    }>;

    getCurrentUser(id: string): Promise<CurrentUserResDto>;

    refreshToken(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string }>;

    loginWithGoogle(
        googleToken: string,
        role: Role
    ): Promise<{
        accessToken: string;
        refreshToken: string;
        user: { id: string; email: string; name: string; role: string };
    }>;

    resendOtp(dto: resendOtpRequestDto): Promise<RegisterInitResponseDto>;
    forgotPassword(dto: ForgotPasswordRequestDto): Promise<{ message: string }>;
    resetPassword(dto: ResetPasswordrequestDto): Promise<{ message: string }>;
}
