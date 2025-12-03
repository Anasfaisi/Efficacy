import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import bcrypt from 'bcrypt';
import { IAuthService } from './Interfaces/IAuth.service';
import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IUnverifiedUserRepository } from '@/repositories/interfaces/IUnverified-user.repository';
import { ITokenService } from './Interfaces/IToken.service';
import { IOtpService } from './Interfaces/IOtp.service';
import { IValidationService } from './Interfaces/IValidation.service';
import { IGoogleVerificationService } from './Interfaces/IGoogle-verifcation.service';
import { Role } from '@/types/role.types';
import {
    CurrentUserResDto,
    LoginResponseDTO,
    OtpVerificationResponseDto,
    ProfileResponseDto,
    RegisterInitResponseDto,
    userGoogleLoginResponseDto,
} from '@/Dto/response.dto';
import {
    CurrentUserReqDto,
    ForgotPasswordRequestDto,
    LoginRequestDto,
    ProfilePicUpdateDto,
    ProfileRequestDto,
    resendOtpRequestDto,
    ResetPasswordrequestDto,
    userGoogleLoginRequestDto,
} from '@/Dto/request.dto';
import { IAdmin } from '@/models/Admin.model';
import { ErrorMessages } from '@/types/response-messages.types';
import {
    MentorOtpVerificationRequestDto,
    MentorRegisterRequestDto,
} from '@/Dto/mentorRequest.dto';
import {
    MentorOtpVerificationResponseDto,
    MentorRegisterInitResponseDto,
} from '@/Dto/mentorResponse.dto';
import { mentorStatus } from '@/types/mentor-status.types';

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.AdminRepository)
        private _adminRepository: IAdminRepository<IAdmin>,
        @inject(TYPES.UserRepository)
        private _userRepository: IUserRepository,
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository,
        @inject(TYPES.UnverifiedUserRepository)
        private _unverifiedUserRepository: IUnverifiedUserRepository,

        @inject(TYPES.TokenService) private _tokenService: ITokenService,
        @inject(TYPES.OtpService) private _otpService: IOtpService,
        @inject(TYPES.ValidationService)
        private _validationService: IValidationService,
        @inject(TYPES.GoogleVerificationService)
        private _googleVerificationService: IGoogleVerificationService
    ) {}

    async updateUserProfile(
        data: ProfileRequestDto,
        id: string
    ): Promise<ProfileResponseDto> {
        const dto = new ProfileRequestDto(
            data.name,
            data.userId,
            data.email,
            data.password,
            data.role,
            data.bio,
            data.headline,
            data.profilePic,
            data.dob,
            data.subscription
        );

        const updatedUser = await this._userRepository.updateUser(id, dto);

        if (!updatedUser) throw new Error(ErrorMessages.UpdateFailed);

        return new ProfileResponseDto(
            updatedUser.id.toString(),
            updatedUser.name,
            updatedUser.email,
            updatedUser.role,
            updatedUser.userId,
            updatedUser?.subscription,
            updatedUser?.bio,
            updatedUser?.headline,
            updatedUser?.profilePic,
            updatedUser?.dob
        );
    }

    async updateUserProfilePic(
        data: ProfilePicUpdateDto
    ): Promise<ProfileResponseDto> {
        const dto = new ProfilePicUpdateDto(data.file, data.id);

        const baseUrl = process.env.BASE_URL;

        const fileUrl = `${baseUrl}/uploads/${dto.file.filename}`;
        const updatedProfiePic = await this._userRepository.updateProfilePic(
            dto.id,
            fileUrl
        );
        if (!updatedProfiePic) throw new Error(ErrorMessages.UpdateFailed);

        return new ProfileResponseDto(
            updatedProfiePic.id.toString(),
            updatedProfiePic.name,
            updatedProfiePic.email,
            updatedProfiePic.role,
            updatedProfiePic?.userId,
            updatedProfiePic?.subscription,
            updatedProfiePic?.bio,
            updatedProfiePic?.headline,
            updatedProfiePic?.profilePic,
            updatedProfiePic?.dob
        );
    }

    async login(loginDto: LoginRequestDto): Promise<LoginResponseDTO> {
        this._validationService.validateLoginInput({
            email: loginDto.email,
            password: loginDto.password,
            role: loginDto.role,
        });

        const account = await this._userRepository.findByEmail(loginDto.email);
        if (!account) throw new Error('User not found');

        if (!(await bcrypt.compare(loginDto.password, account.password))) {
            throw new Error('Invalid email or password');
        }

        const accessToken = this._tokenService.generateAccessToken(
            account.id,
            account.role
        );

        const refreshToken = this._tokenService.generateRefreshToken(
            account.id,
            account.role
        );

        return new LoginResponseDTO(accessToken, refreshToken, {
            id: account.id.toString(),
            name: account.name,
            email: account.email,
            role: account.role as Role,
            subscription: account?.subscription,
            bio: account?.bio,
            headline: account?.headline,
            profilePic: account?.profilePic,
            dob: account?.dob,
            xpPoints: account.xpPoints,
            badge: account?.badge,
        });
    }

    async registerInit({
        email,
        password,
        name,
        role,
    }: {
        email: string;
        password: string;
        name: string;
        role: Role;
    }) {
        this._validationService.validateRegisterInput({
            email,
            password,
            name,
        });

        let repository: IUserRepository;
        if (role === 'user') {
            repository = this._userRepository;
        } else {
            throw new Error('invalid role');
        }

        const account = await repository.findByEmail(email);
        if (account) throw new Error('Email already registered');

        const existingUnverified =
            await this._unverifiedUserRepository.findByEmail(email);
        if (existingUnverified) throw new Error(`OTP already sent to ${email}`);

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = await this._otpService.generateOtp();
        console.log(otp, 'in register');
        const unverifiedUser = await this._unverifiedUserRepository.create({
            email,
            password: hashedPassword,
            name,
            role,
            otp,
            otpExpiresAt: new Date(Date.now() + 2 * 60 * 1000),
            // lastOtpSent: new Date(Date.now()),
            resendAvailableAt: new Date(Date.now() + 60 * 1000),
        });

        await this._otpService.sendOtp(email, otp);
        return new RegisterInitResponseDto(
            unverifiedUser.email,
            unverifiedUser.role,
            unverifiedUser.resendAvailableAt
        );
    }

    async registerVerify(email: string, otp: string) {
        const unverifiedUser =
            await this._unverifiedUserRepository.findByEmail(email);
        if (!unverifiedUser)
            throw new Error('No pending registration for this email');

        if (unverifiedUser.otp !== otp) throw new Error('Invalid OTP');
        if (unverifiedUser.otpExpiresAt < new Date())
            throw new Error(ErrorMessages.OtpExpired);
        let _repository: IUserRepository;
        if (unverifiedUser.role === 'user') {
            _repository = this._userRepository;
        } else {
            throw new Error('invalid role');
        }

        const user = await _repository.createUser({
            email: unverifiedUser.email,
            password: unverifiedUser.password,
            name: unverifiedUser.name,
            role: unverifiedUser.role,
        });

        await this._unverifiedUserRepository.deleteByEmail(email);
        const accessToken = this._tokenService.generateAccessToken(
            user.id,
            user.role
        );
        const refreshToken = this._tokenService.generateRefreshToken(
            user.id,
            user.role
        );
        // await this._unverifiedUserRepository.deleteByEmail(unverifiedUser.email);
        return new OtpVerificationResponseDto(accessToken, refreshToken, {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        });
    }

    async resendOtp(dto: resendOtpRequestDto) {
        const unverifiedUser = await this._unverifiedUserRepository.findByEmail(
            dto.email
        );
        if (!unverifiedUser) {
            throw new Error('Session expired, please register again');
        }

        const now = Date.now();
        const OTP_EXPIRY_MS = 5 * 60 * 1000;
        const RESEND_DELAY_MS = 60 * 1000;

        let otp = unverifiedUser.otp;
        let otpExpiresAt = new Date(unverifiedUser.otpExpiresAt).getTime();

        if (now >= otpExpiresAt) {
            otp = await this._otpService.generateOtp();
            otpExpiresAt = now + OTP_EXPIRY_MS;
        }

        const updatedUser = await this._unverifiedUserRepository.updateByEmail(
            dto.email,
            {
                otp,
                otpExpiresAt: new Date(otpExpiresAt),
                lastOtpSent: new Date(now),
                resendAvailableAt: new Date(now + RESEND_DELAY_MS + 1),
            }
        );
        console.log(updatedUser);
        if (!updatedUser) {
            throw new Error('error happened in creating new user');
        }
        await this._otpService.sendOtp(dto.email, otp);

        return new RegisterInitResponseDto(
            updatedUser.email,
            updatedUser.role,
            updatedUser.resendAvailableAt
        );
    }

    async forgotPassword(
        dto: ForgotPasswordRequestDto
    ): Promise<{ message: string }> {
        const user = await this._userRepository.findByEmail(dto.email);
        console.log(user);
        if (!user) throw new Error('User not exist in this email');

        const resetToken = this._tokenService.generatePasswordResetToken(
            user.id
        );
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await this._otpService.sendEmail(
            user.email,
            'Reset Your Password',
            `Click here to reset: ${resetLink}`
        );
        return { message: 'Reset link sent to email' };
    }

    async resetPassword(
        dto: ResetPasswordrequestDto
    ): Promise<{ message: string }> {
        const payload = this._tokenService.verifyPasswordResetToken(dto.token);
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

        await this._userRepository.updatePasswordById(
            payload.id,
            hashedPassword
        );

        return { message: 'Password reset successful' };
    }

    async refreshToken(refreshToken: string) {
        const payload = this._tokenService.verifyRefreshToken(refreshToken);
        const repository =
            payload.role === 'admin'
                ? this._adminRepository
                : payload.role === 'mentor'
                  ? this._mentorRepository
                  : this._userRepository;

        const account = await repository.findById(payload.id);
        if (!account) {
            throw new Error('User not found');
        }

        const accessToken = this._tokenService.generateAccessToken(
            account.id,
            account.role
        );
        const newRefreshToken = this._tokenService.generateRefreshToken(
            account.id,
            account.role
        );

        return { accessToken, refreshToken: newRefreshToken };
    }

    async userLoginWithGoogle(dto: userGoogleLoginRequestDto) {
        const ticket = await this._googleVerificationService.verify(
            dto.googleToken
        );
        const payload = ticket.getPayload();

        if (!payload?.email) {
            throw new Error('Google login failed: No email found');
        }

        let account = await this._userRepository.findByEmail(payload.email);
        if (!account) {
            account = await this._userRepository.createUser({
                email: payload.email,
                name: payload.name || 'Google User',
                googleId: payload.sub,
                role: Role.User,
                password:
                    '$2a$10$BvNq8r.X.3zVWQs2Q7wJmeyGYqLMV/P6cyVUFyoLsEL1rXEmWMiiW' /*string = Abcd@1234*/,
            });
        }

        const accessToken = this._tokenService.generateAccessToken(
            account.id,
            account.role
        );
        const refreshToken = this._tokenService.generateRefreshToken(
            account.id,
            account.role
        );

        return new userGoogleLoginResponseDto(accessToken, refreshToken, {
            id: account._id.toString(),
            email: account.email,
            name: account.name,
            role: account.role,
        });
    }

    /*======= admin auth ===========*/

    async AdminLogin(email: string, password: string, role: Role) {
        this._validationService.validateLoginInput({
            email,
            password,
            role,
        });

        const account = await this._adminRepository.findByEmail(email);
        if (!account) throw new Error('User not found');

        if (!(await bcrypt.compare(password, account.password))) {
            throw new Error('Invalid email or password');
        }

        const accessToken = this._tokenService.generateAccessToken(
            account.id,
            account.role
        );

        const refreshToken = this._tokenService.generateRefreshToken(
            account.id,
            account.role
        );

        return new LoginResponseDTO(accessToken, refreshToken, {
            id: account.id.toString(),
            name: account.name,
            email: account.email,
            role: role,
        });
    }

    /*=============== mentor Auth =======================*/
    async mentorLogin(email: string, password: string, role: Role) {
        this._validationService.validateLoginInput({
            email,
            password,
            role,
        });

        const account = await this._mentorRepository.findByEmail(email);
        if (!account) throw new Error('User not found');

        if (!(await bcrypt.compare(password, account.password))) {
            throw new Error('Invalid email or password');
        }

        const accessToken = this._tokenService.generateAccessToken(
            account.id,
            account.role
        );

        const refreshToken = this._tokenService.generateRefreshToken(
            account.id,
            account.role
        );

        return new LoginResponseDTO(accessToken, refreshToken, {
            id: account.id.toString(),
            name: account.name,
            email: account.email,
            role: role,
        });
    }

    async mentorRegisterInit(dto: MentorRegisterRequestDto) {
        this._validationService.validateRegisterInput({
            email: dto.email,
            password: dto.password,
            name: dto.name,
        });

        const account = await this._mentorRepository.findByEmail(dto.email);
        if (account) throw new Error('Email already registered');

        const existingUnverified =
            await this._unverifiedUserRepository.findByEmail(dto.email);
        if (existingUnverified)
            throw new Error(`OTP already sent to ${dto.email}`);

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const otp = await this._otpService.generateOtp();
        console.log(otp, 'in register');
        const unverifiedUser = await this._unverifiedUserRepository.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: dto.role,
            otp,
            otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
            resendAvailableAt: new Date(Date.now() + 60 * 1000),
        });

        await this._otpService.sendOtp(dto.email, otp);
        return new MentorRegisterInitResponseDto(
            unverifiedUser.email,
            unverifiedUser.role,
            unverifiedUser.resendAvailableAt
        );
    }

    async mentorRegisterVerify(dto: MentorOtpVerificationRequestDto) {
        const unverifiedUser = await this._unverifiedUserRepository.findByEmail(
            dto.email
        );
        if (!unverifiedUser)
            throw new Error('No pending registration for this email');

        if (unverifiedUser.otp !== dto.otp) throw new Error('Invalid OTP');
        if (unverifiedUser.otpExpiresAt < new Date())
            throw new Error(ErrorMessages.OtpExpired);

        const user = await this._mentorRepository.createUser({
            email: unverifiedUser.email,
            password: unverifiedUser.password,
            name: unverifiedUser.name,
            role: unverifiedUser.role,
        });

        await this._unverifiedUserRepository.deleteByEmail(dto.email);
        const accessToken = this._tokenService.generateAccessToken(
            user.id,
            user.role
        );
        const refreshToken = this._tokenService.generateRefreshToken(
            user.id,
            user.role
        );
        return new MentorOtpVerificationResponseDto(accessToken, refreshToken, {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: Role.Mentor,
            status: mentorStatus.Incomplete
        });
    }
}
