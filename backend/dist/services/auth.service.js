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
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const bcrypt_1 = __importDefault(require("bcrypt"));
const role_types_1 = require("@/types/role.types");
const response_dto_1 = require("@/dto/response.dto");
const request_dto_1 = require("@/dto/request.dto");
const response_messages_types_1 = require("@/types/response-messages.types");
let AuthService = class AuthService {
    _adminRepository;
    _userRepository;
    _mentorRepository;
    _unverifiedUserRepository;
    _tokenService;
    _otpService;
    _validationService;
    _googleVerificationService;
    _passwordService;
    constructor(_adminRepository, _userRepository, _mentorRepository, _unverifiedUserRepository, _tokenService, _otpService, _validationService, _googleVerificationService, _passwordService) {
        this._adminRepository = _adminRepository;
        this._userRepository = _userRepository;
        this._mentorRepository = _mentorRepository;
        this._unverifiedUserRepository = _unverifiedUserRepository;
        this._tokenService = _tokenService;
        this._otpService = _otpService;
        this._validationService = _validationService;
        this._googleVerificationService = _googleVerificationService;
        this._passwordService = _passwordService;
    }
    async updateUserProfile(data, id) {
        const dto = new request_dto_1.ProfileRequestDto(data.name, data.userId, data.email, data.password, data.role, data.bio, data.headline, data.profilePic, data.dob, data.subscription);
        const updatedUser = await this._userRepository.updateUser(id, dto);
        if (!updatedUser)
            throw new Error(response_messages_types_1.ErrorMessages.UpdateFailed);
        return new response_dto_1.ProfileResponseDto(updatedUser.id.toString(), updatedUser.name, updatedUser.email, updatedUser.role, updatedUser.userId, updatedUser?.subscription, updatedUser?.bio, updatedUser?.headline, updatedUser?.profilePic, updatedUser?.dob);
    }
    async updateUserPassword(data, userId) {
        const user = await this._userRepository.findById(userId);
        if (!user)
            throw new Error(response_messages_types_1.ErrorMessages.UserNotFound);
        const verifiedUser = await this._passwordService.verifyPassword(data.currentPassword, user.password);
        if (!verifiedUser)
            throw new Error(response_messages_types_1.ErrorMessages.InvalidPassword);
        const hashedPassword = await this._passwordService.hashPassword(data.newPassword);
        if (!hashedPassword)
            throw new Error(response_messages_types_1.ErrorMessages.InvalidPassword);
        await this._userRepository.updatePasswordById(userId, hashedPassword);
    }
    async updateUserProfilePic(data) {
        const dto = new request_dto_1.ProfilePicUpdateDto(data.file, data.id);
        const fileUrl = dto.file.location;
        const updatedProfiePic = await this._userRepository.updateProfilePic(dto.id, fileUrl);
        if (!updatedProfiePic)
            throw new Error(response_messages_types_1.ErrorMessages.UpdateFailed);
        return new response_dto_1.ProfileResponseDto(updatedProfiePic.id.toString(), updatedProfiePic.name, updatedProfiePic.email, updatedProfiePic.role, updatedProfiePic?.userId, updatedProfiePic?.subscription, updatedProfiePic?.bio, updatedProfiePic?.headline, updatedProfiePic?.profilePic, updatedProfiePic?.dob);
    }
    async login(loginDto) {
        this._validationService.validateLoginInput({
            email: loginDto.email,
            password: loginDto.password,
            role: loginDto.role,
        });
        const account = await this._userRepository.findByEmail(loginDto.email);
        if (!account)
            throw new Error(response_messages_types_1.ErrorMessages.UserNotFound);
        if (account.isActive === false)
            throw new Error(response_messages_types_1.ErrorMessages.AccountBlocked);
        if (!(await bcrypt_1.default.compare(loginDto.password, account.password))) {
            throw new Error(response_messages_types_1.ErrorMessages.InvalidCredentials);
        }
        const accessToken = this._tokenService.generateAccessToken(account.id, account.role, account.email);
        const refreshToken = this._tokenService.generateRefreshToken(account.id, account.role, account.email);
        return new response_dto_1.LoginResponseDTO(accessToken, refreshToken, {
            id: account.id.toString(),
            name: account.name,
            email: account.email,
            role: account.role,
            subscription: account?.subscription,
            bio: account?.bio,
            headline: account?.headline,
            profilePic: account?.profilePic,
            dob: account?.dob,
            xpPoints: account.xpPoints,
            badge: account?.badge,
        });
    }
    async registerInit(dto) {
        this._validationService.validateRegisterInput({
            email: dto.email,
            password: dto.password,
            name: dto.name,
        });
        const account = await this._userRepository.findByEmail(dto.email);
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
            otpExpiresAt: new Date(Date.now() + 2 * 60 * 1000),
            resendAvailableAt: new Date(Date.now() + 30 * 1000),
        });
        await this._otpService.sendOtp(dto.email, otp);
        return new response_dto_1.RegisterInitResponseDto(unverifiedUser.email, unverifiedUser.role, unverifiedUser.resendAvailableAt);
    }
    async registerVerify(dto) {
        const unverifiedUser = await this._unverifiedUserRepository.findByEmail(dto.email);
        if (!unverifiedUser)
            throw new Error(response_messages_types_1.ErrorMessages.RegistrationReinitRequired);
        if (unverifiedUser.otp !== dto.otp)
            throw new Error(response_messages_types_1.AuthMessages.OtpFailed);
        if (unverifiedUser.otpExpiresAt < new Date())
            throw new Error(response_messages_types_1.ErrorMessages.OtpExpired);
        let _repository;
        if (unverifiedUser.role === 'user') {
            _repository = this._userRepository;
        }
        else {
            throw new Error(response_messages_types_1.ErrorMessages.InvalidRole);
        }
        const user = await _repository.createUser({
            email: unverifiedUser.email,
            password: unverifiedUser.password,
            name: unverifiedUser.name,
            role: unverifiedUser.role,
        });
        await this._unverifiedUserRepository.deleteByEmail(dto.email);
        const accessToken = this._tokenService.generateAccessToken(user.id, user.role, user.email);
        const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role, user.email);
        return new response_dto_1.OtpVerificationResponseDto(accessToken, refreshToken, {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        });
    }
    async resendOtp(dto) {
        console.log(dto.email, 'dto . email');
        const unverifiedUser = await this._unverifiedUserRepository.findByEmail(dto.email);
        if (!unverifiedUser) {
            throw new Error(response_messages_types_1.ErrorMessages.SessionExpired);
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
        const updatedUser = await this._unverifiedUserRepository.updateByEmail(dto.email, {
            otp,
            otpExpiresAt: new Date(otpExpiresAt),
            lastOtpSent: new Date(now),
            resendAvailableAt: new Date(now + RESEND_DELAY_MS + 1),
        });
        if (!updatedUser) {
            throw new Error(response_messages_types_1.ErrorMessages.UserCreationFailed);
        }
        await this._otpService.sendOtp(dto.email, otp);
        return new response_dto_1.RegisterInitResponseDto(updatedUser.email, updatedUser.role, updatedUser.resendAvailableAt);
    }
    async forgotPassword(dto) {
        const user = await this._userRepository.findByEmail(dto.email);
        console.log(user);
        if (!user)
            throw new Error(response_messages_types_1.ErrorMessages.UserNotFound);
        const resetToken = this._tokenService.generatePasswordResetToken(user.id);
        const resetLink = `${process.env.FRONTEND_URL}/mentor/reset-password?token=${resetToken}`;
        await this._otpService.sendEmail(user.email, 'Reset Your Password', `Click here to reset: ${resetLink}`);
        return { message: response_messages_types_1.AuthMessages.OtpSuccess };
    }
    async resetPassword(dto) {
        const payload = this._tokenService.verifyPasswordResetToken(dto.token);
        const hashedPassword = await bcrypt_1.default.hash(dto.newPassword, 10);
        await this._userRepository.updatePasswordById(payload.id, hashedPassword);
        return { message: response_messages_types_1.SuccessMessages.PasswordResetSuccess };
    }
    async refreshToken(refreshToken) {
        const payload = this._tokenService.verifyRefreshToken(refreshToken);
        const repository = payload.role === 'admin'
            ? this._adminRepository
            : payload.role === 'mentor'
                ? this._mentorRepository
                : this._userRepository;
        const account = await repository.findById(payload.id);
        if (!account) {
            throw new Error(response_messages_types_1.ErrorMessages.UserNotFound);
        }
        if ('isActive' in account && account.isActive === false) {
            throw new Error(response_messages_types_1.ErrorMessages.AccountBlocked);
        }
        if ('status' in account && account.status === 'inactive') {
            throw new Error(response_messages_types_1.ErrorMessages.AccountInactive);
        }
        const accessToken = this._tokenService.generateAccessToken(account.id, account.role, account.email);
        const newRefreshToken = this._tokenService.generateRefreshToken(account.id, account.role, account.email);
        return { accessToken, refreshToken: newRefreshToken };
    }
    async userLoginWithGoogle(dto) {
        const ticket = await this._googleVerificationService.verify(dto.googleToken);
        const payload = ticket.getPayload();
        if (!payload?.email) {
            throw new Error(response_messages_types_1.ErrorMessages.NoEmailFromGoogle);
        }
        let account = await this._userRepository.findByEmail(payload.email);
        if (!account) {
            account = await this._userRepository.createUser({
                email: payload.email,
                name: payload.name || 'Google User',
                googleId: payload.sub,
                role: role_types_1.Role.User,
                password: '$2a$10$BvNq8r.X.3zVWQs2Q7wJmeyGYqLMV/P6cyVUFyoLsEL1rXEmWMiiW' /*string = Abcd@1234*/,
            });
        }
        if (account.isActive === false)
            throw new Error(response_messages_types_1.ErrorMessages.AccountBlocked);
        const accessToken = this._tokenService.generateAccessToken(account.id, account.role, account.email);
        const refreshToken = this._tokenService.generateRefreshToken(account.id, account.role, account.email);
        return new response_dto_1.userGoogleLoginResponseDto(accessToken, refreshToken, {
            id: account._id.toString(),
            email: account.email,
            name: account.name,
            role: account.role,
        });
    }
    /*======= admin auth ===========*/
    async AdminLogin(email, password, role) {
        this._validationService.validateLoginInput({
            email,
            password,
            role,
        });
        const account = await this._adminRepository.findByEmail(email);
        if (!account)
            throw new Error(response_messages_types_1.ErrorMessages.UserNotFound);
        if (!(await bcrypt_1.default.compare(password, account.password))) {
            throw new Error(response_messages_types_1.ErrorMessages.InvalidCredentials);
        }
        const accessToken = this._tokenService.generateAccessToken(account.id, account.role, account.email);
        const refreshToken = this._tokenService.generateRefreshToken(account.id, account.role, account.email);
        return new response_dto_1.LoginResponseDTO(accessToken, refreshToken, {
            id: account.id.toString(),
            name: account.name,
            email: account.email,
            role: role,
        });
    }
    async logout() {
        return Promise.resolve();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.AdminRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserRepository)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorRepository)),
    __param(3, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UnverifiedUserRepository)),
    __param(4, (0, inversify_1.inject)(inversify_key_types_1.TYPES.TokenService)),
    __param(5, (0, inversify_1.inject)(inversify_key_types_1.TYPES.OtpService)),
    __param(6, (0, inversify_1.inject)(inversify_key_types_1.TYPES.ValidationService)),
    __param(7, (0, inversify_1.inject)(inversify_key_types_1.TYPES.GoogleVerificationService)),
    __param(8, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PasswordService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map