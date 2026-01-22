import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import bcrypt from 'bcrypt';
import { IMentorAuthService } from './Interfaces/IMentor-auth.service';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IUnverifiedUserRepository } from '@/repositories/interfaces/IUnverified-user.repository';
import { ITokenService } from './Interfaces/IToken.service';
import { IOtpService } from './Interfaces/IOtp.service';
import { IValidationService } from './Interfaces/IValidation.service';
import { IGoogleVerificationService } from './Interfaces/IGoogle-verifcation.service';
import { Role } from '@/types/role.types';
import {
    MentorLoginResponseDTO,
    MentorOtpVerificationResponseDto,
    MentorRegisterInitResponseDto,
} from '@/Dto/mentorResponse.dto';
import {
    LoginRequestDto,
    ForgotPasswordRequestDto,
    ResetPasswordrequestDto,
    userGoogleLoginRequestDto,
    resendOtpRequestDto,
} from '@/Dto/request.dto';
import {
    MentorOtpVerificationRequestDto,
    MentorRegisterRequestDto,
} from '@/Dto/mentorRequest.dto';
import { userGoogleLoginResponseDto } from '@/Dto/response.dto';
import { mentorStatus } from '@/types/mentor-status.types';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class MentorAuthService implements IMentorAuthService {
    constructor(
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

    async mentorLogin(dto: LoginRequestDto) {
        const account = await this._mentorRepository.findByEmail(dto.email);
        if (!account) throw new Error('User not found');

        if (
            !account.password ||
            !(await bcrypt.compare(dto.password, account.password))
        ) {
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

        return new MentorLoginResponseDTO(accessToken, refreshToken, {
            id: account.id.toString(),
            name: account.name,
            email: account.email,
            role: account.role as Role,
            status: account.status,
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
            resendAvailableAt: new Date(Date.now() + 30 * 1000),
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
            status: mentorStatus.Incomplete,
        });
    }

    async mentorLoginWithGoogle(dto: userGoogleLoginRequestDto) {
        const ticket = await this._googleVerificationService.verify(
            dto.googleToken
        );
        const payload = ticket.getPayload();

        if (!payload?.email) {
            throw new Error('Google login failed: No email found');
        }

        let account = await this._mentorRepository.findByEmail(payload.email);
        if (!account) {
            account = await this._mentorRepository.createUser({
                email: payload.email,
                name: payload.name || 'Google Mentor',
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
                role: Role.Mentor,
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
            id: account.id.toString(),
            email: account.email,
            name: account.name,
            role: account.role as Role,
        });
    }

    async mentorResendOtp(dto: resendOtpRequestDto) {
        const unverifiedUser = await this._unverifiedUserRepository.findByEmail(
            dto.email
        );
        if (!unverifiedUser) {
            throw new Error('Session expired, please register again');
        }

        const now = Date.now();
        const OTP_EXPIRY_MS = 5 * 60 * 1000;
        const RESEND_DELAY_MS = 30 * 1000;

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

        if (!updatedUser) {
            throw new Error('error happened in updating user otp');
        }
        await this._otpService.sendOtp(dto.email, otp);

        return new MentorRegisterInitResponseDto(
            updatedUser.email,
            updatedUser.role,
            updatedUser.resendAvailableAt
        );
    }

    async mentorForgotPassword(
        dto: ForgotPasswordRequestDto
    ): Promise<{ message: string }> {
        const mentor = await this._mentorRepository.findByEmail(dto.email);
        if (!mentor) throw new Error('Mentor not found with this email');

        const resetToken = this._tokenService.generatePasswordResetToken(
            mentor.id
        );
        // Pointing to mentor specific reset page
        const resetLink = `${process.env.FRONTEND_URL}/mentor/reset-password?token=${resetToken}`;
        await this._otpService.sendEmail(
            mentor.email,
            'Reset Your Password',
            `Click here to reset your mentor account password: ${resetLink}`
        );
        return { message: 'Reset link sent to email' };
    }

    async mentorResetPassword(
        dto: ResetPasswordrequestDto
    ): Promise<{ message: string }> {
        const payload = this._tokenService.verifyPasswordResetToken(dto.token);
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

        await this._mentorRepository.update(payload.id, {
            password: hashedPassword,
        });

        return { message: 'Password reset successful' };
    }

    async logout(refreshToken: string): Promise<void> {
        return Promise.resolve();
    }
}
