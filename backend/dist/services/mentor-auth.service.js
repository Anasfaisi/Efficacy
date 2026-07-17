"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorAuthService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const bcrypt_1 = __importDefault(require("bcrypt"));
const role_types_1 = require("@/types/role.types");
const mentorResponse_dto_1 = require("@/dto/mentorResponse.dto");
const response_dto_1 = require("@/dto/response.dto");
const mentor_status_types_1 = require("@/types/mentor-status.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let MentorAuthService = class MentorAuthService {
    _mentorRepository;
    _unverifiedUserRepository;
    _tokenService;
    _otpService;
    _validationService;
    _googleVerificationService;
    constructor(_mentorRepository, _unverifiedUserRepository, _tokenService, _otpService, _validationService, _googleVerificationService) {
        this._mentorRepository = _mentorRepository;
        this._unverifiedUserRepository = _unverifiedUserRepository;
        this._tokenService = _tokenService;
        this._otpService = _otpService;
        this._validationService = _validationService;
        this._googleVerificationService = _googleVerificationService;
    }
    async mentorLogin(dto) {
        const account = await this._mentorRepository.findByEmail(dto.email);
        if (!account)
            throw new Error(response_messages_types_1.ErrorMessages.UserNotFound);
        if (!account.password ||
            !(await bcrypt_1.default.compare(dto.password, account.password))) {
            throw new Error(response_messages_types_1.ErrorMessages.InvalidCredentials);
        }
        const accessToken = this._tokenService.generateAccessToken(account.id, account.role, account.email);
        const refreshToken = this._tokenService.generateRefreshToken(account.id, account.role, account.email);
        return new mentorResponse_dto_1.MentorLoginResponseDTO(accessToken, refreshToken, {
            id: account.id.toString(),
            name: account.name,
            email: account.email,
            role: account.role,
            status: account.status,
        });
    }
    async mentorRegisterInit(dto) {
        this._validationService.validateRegisterInput({
            email: dto.email,
            password: dto.password,
            name: dto.name,
        });
        const account = await this._mentorRepository.findByEmail(dto.email);
        if (account)
            throw new Error(response_messages_types_1.ErrorMessages.EmailAlreadyRegistered);
        const existingUnverified = await this._unverifiedUserRepository.findByEmail(dto.email);
        if (existingUnverified)
            throw new Error(response_messages_types_1.ErrorMessages.OtpAlreadySent);
        const hashedPassword = await bcrypt_1.default.hash(dto.password, 10);
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
        return new mentorResponse_dto_1.MentorRegisterInitResponseDto(unverifiedUser.email, unverifiedUser.role, unverifiedUser.resendAvailableAt);
    }
    async mentorRegisterVerify(dto) {
        const unverifiedUser = await this._unverifiedUserRepository.findByEmail(dto.email);
        if (!unverifiedUser)
            throw new Error(response_messages_types_1.ErrorMessages.RegistrationReinitRequired);
        if (unverifiedUser.otp !== dto.otp)
            throw new Error(response_messages_types_1.AuthMessages.OtpFailed);
        if (unverifiedUser.otpExpiresAt < new Date())
            throw new Error(response_messages_types_1.ErrorMessages.OtpExpired);
        const user = await this._mentorRepository.createUser({
            email: unverifiedUser.email,
            password: unverifiedUser.password,
            name: unverifiedUser.name,
            role: unverifiedUser.role,
        });
        await this._unverifiedUserRepository.deleteByEmail(dto.email);
        const accessToken = this._tokenService.generateAccessToken(user.id, user.role, user.email);
        const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role, user.email);
        return new mentorResponse_dto_1.MentorOtpVerificationResponseDto(accessToken, refreshToken, {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: role_types_1.Role.Mentor,
            status: mentor_status_types_1.mentorStatus.Incomplete,
        });
    }
    async mentorLoginWithGoogle(dto) {
        const ticket = await this._googleVerificationService.verify(dto.googleToken);
        const payload = ticket.getPayload();
        if (!payload?.email) {
            throw new Error(response_messages_types_1.ErrorMessages.NoEmailFromGoogle);
        }
        let account = await this._mentorRepository.findByEmail(payload.email);
        if (!account) {
            account = await this._mentorRepository.createUser({
                email: payload.email,
                name: payload.name || 'Google Mentor',
                password: await bcrypt_1.default.hash(Math.random().toString(36), 10),
                role: role_types_1.Role.Mentor,
            });
        }
        const accessToken = this._tokenService.generateAccessToken(account.id, account.role, account.email);
        const refreshToken = this._tokenService.generateRefreshToken(account.id, account.role, account.email);
        return new response_dto_1.userGoogleLoginResponseDto(accessToken, refreshToken, {
            id: account.id.toString(),
            email: account.email,
            name: account.name,
            role: account.role,
        });
    }
    async mentorResendOtp(dto) {
        const unverifiedUser = await this._unverifiedUserRepository.findByEmail(dto.email);
        if (!unverifiedUser) {
            throw new Error(response_messages_types_1.ErrorMessages.SessionExpired);
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
        const updatedUser = await this._unverifiedUserRepository.updateByEmail(dto.email, {
            otp,
            otpExpiresAt: new Date(otpExpiresAt),
            lastOtpSent: new Date(now),
            resendAvailableAt: new Date(now + RESEND_DELAY_MS + 1),
        });
        if (!updatedUser) {
            throw new Error(response_messages_types_1.ErrorMessages.OtpUpdateFailed);
        }
        await this._otpService.sendOtp(dto.email, otp);
        return new mentorResponse_dto_1.MentorRegisterInitResponseDto(updatedUser.email, updatedUser.role, updatedUser.resendAvailableAt);
    }
    async mentorForgotPassword(dto) {
        const mentor = await this._mentorRepository.findByEmail(dto.email);
        if (!mentor)
            throw new Error(response_messages_types_1.ErrorMessages.MentorNotFound);
        const resetToken = this._tokenService.generatePasswordResetToken(mentor.id);
        const resetLink = `${process.env.FRONTEND_URL}/mentor/reset-password?token=${resetToken}`;
        await this._otpService.sendEmail(mentor.email, 'Reset Your Password', `Click here to reset your mentor account password: ${resetLink}`);
        return { message: response_messages_types_1.AuthMessages.OtpSuccess };
    }
    async mentorResetPassword(dto) {
        const payload = this._tokenService.verifyPasswordResetToken(dto.token);
        const hashedPassword = await bcrypt_1.default.hash(dto.newPassword, 10);
        await this._mentorRepository.update(payload.id, {
            password: hashedPassword,
        });
        return { message: response_messages_types_1.SuccessMessages.PasswordResetSuccess };
    }
    async logout() {
        return Promise.resolve();
    }
};
exports.MentorAuthService = MentorAuthService;
exports.MentorAuthService = MentorAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UnverifiedUserRepository)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.TokenService)),
    __param(3, (0, inversify_1.inject)(inversify_key_types_1.TYPES.OtpService)),
    __param(4, (0, inversify_1.inject)(inversify_key_types_1.TYPES.ValidationService)),
    __param(5, (0, inversify_1.inject)(inversify_key_types_1.TYPES.GoogleVerificationService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], MentorAuthService);
//# sourceMappingURL=mentor-auth.service.js.map