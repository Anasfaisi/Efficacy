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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const inversify_key_types_1 = require("@/config/inversify-key.types");
const inversify_1 = require("inversify");
const response_dto_1 = require("@/dto/response.dto");
const response_messages_types_1 = require("@/types/response-messages.types");
let AdminAuthService = class AdminAuthService {
    _adminRepository;
    _passwordService;
    _tokenService;
    constructor(_adminRepository, _passwordService, _tokenService) {
        this._adminRepository = _adminRepository;
        this._passwordService = _passwordService;
        this._tokenService = _tokenService;
    }
    async adminLogin(login) {
        const admin = await this._adminRepository.findByEmail(login.email);
        if (!admin)
            throw new Error(response_messages_types_1.ErrorMessages.NoAdmin);
        const isMatch = await this._passwordService.verifyPassword(login.password, admin.password);
        if (!isMatch)
            throw new Error(response_messages_types_1.ErrorMessages.InvalidCredentials);
        const accessToken = this._tokenService.generateAccessToken(admin.id, admin.role, admin.email);
        const refreshToken = this._tokenService.generateRefreshToken(admin.id, admin.role, admin.email);
        return new response_dto_1.AdminLoginRespondseDto({
            id: admin.id,
            email: admin.email,
            role: admin.role,
        }, accessToken, refreshToken);
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.AdminRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PasswordService)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.TokenService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map