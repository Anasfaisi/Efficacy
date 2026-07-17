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
exports.UserController = void 0;
const inversify_key_types_1 = require("@/config/inversify-key.types");
const inversify_1 = require("inversify");
const response_messages_types_1 = require("@/types/response-messages.types");
let UserController = class UserController {
    _authService;
    _notificationService;
    constructor(_authService, _notificationService) {
        this._authService = _authService;
        this._notificationService = _notificationService;
    }
    async updateUserProfile(req, res) {
        try {
            if (!req.currentUser?.id) {
                res.status(400 /* code.BAD_REQUEST */).json({
                    message: response_messages_types_1.ErrorMessages.NoParams,
                });
                return;
            }
            const updatedUser = await this._authService.updateUserProfile(req.body, req.currentUser?.id);
            if (!updatedUser) {
                res.status(400 /* code.BAD_REQUEST */).json({
                    message: response_messages_types_1.ErrorMessages.UpdateUserFailed,
                });
                return;
            }
            else {
                res.status(200 /* code.OK */).json(updatedUser);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('updateProfile error:', error);
                res.status(500 /* code.INTERNAL_SERVER_ERROR */).json({
                    message: error.message,
                });
            }
            else {
                console.error('Unknown error:', error);
                res.status(500 /* code.INTERNAL_SERVER_ERROR */).json({
                    message: response_messages_types_1.CommonMessages.UnexpectedError,
                });
            }
        }
    }
    async updateProfilePic(req, res) {
        try {
            if (!req.file) {
                res.status(400 /* code.BAD_REQUEST */).json({
                    message: response_messages_types_1.ErrorMessages.FileNotAttached,
                });
                return;
            }
            if (!req.currentUser?.id) {
                res.status(400 /* code.BAD_REQUEST */).json({
                    message: response_messages_types_1.ErrorMessages.NoParams,
                });
                return;
            }
            const updatedProfilePic = await this._authService.updateUserProfilePic({
                file: req.file,
                id: req.currentUser?.id,
            });
            console.log(updatedProfilePic, 'from user controller');
            if (!updatedProfilePic) {
                res.status(400 /* code.BAD_REQUEST */).json({
                    messages: response_messages_types_1.ErrorMessages.UpdateProfilePicFailed,
                });
                return;
            }
            res.status(200 /* code.OK */).json({
                message: response_messages_types_1.SuccessMessages.ProfilePicUpdated,
                user: updatedProfilePic,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('updateProfilePic error:', error);
                res.status(500 /* code.INTERNAL_SERVER_ERROR */).json({
                    message: error.message,
                });
            }
            else {
                console.error('Unknown error:', error);
                res.status(500 /* code.INTERNAL_SERVER_ERROR */).json({
                    message: response_messages_types_1.CommonMessages.UnexpectedError,
                });
            }
        }
    }
    async updatePassword(req, res) {
        const userId = req.currentUser?.id;
        await this._authService.updateUserPassword(req.body, userId);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.PasswordUpdateSuccess,
        });
    }
    async login(req, res) {
        try {
            const { accessToken, refreshToken, user } = await this._authService.login(req.body);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
            });
            res.status(200 /* code.OK */).json({ user });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.LoginFailed;
            res.status(400 /* code.BAD_REQUEST */).json({ message });
        }
    }
    async registerInit(req, res) {
        const result = await this._authService.registerInit(req.body);
        res.status(200 /* code.OK */).json({
            ...result,
            message: response_messages_types_1.AuthMessages.OtpSuccess,
        });
    }
    async registerVerify(req, res) {
        const { accessToken, refreshToken, user } = await this._authService.registerVerify(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(200 /* code.OK */).json(user);
    }
    async resendOtp(req, res) {
        console.log(req.body.email, 'req.body.emai');
        const { tempEmail, resendAvailableAt } = await this._authService.resendOtp(req.body);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.OtpSent,
            tempEmail,
            resendAvailableAt,
        });
    }
    async forgotPassword(req, res) {
        const result = await this._authService.forgotPassword(req.body);
        res.status(200 /* code.OK */).json(result);
    }
    async resetPassword(req, res) {
        const result = await this._authService.resetPassword(req.body);
        res.status(200 /* code.OK */).json(result);
    }
    async refreshTokenHandler(req, res) {
        try {
            const token = req.cookies.refreshToken;
            if (!token) {
                throw new Error('No refresh token provided');
            }
            const { accessToken, refreshToken } = await this._authService.refreshToken(token);
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            res.status(200 /* code.OK */).json({ success: true });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.TokenRefreshFailed;
            res.status(401 /* code.UNAUTHORIZED */).json({ message });
        }
    }
    async googleAuth(req, res) {
        const result = await this._authService.userLoginWithGoogle(req.body);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(200 /* code.OK */).json({ user: result.user });
    }
    async logout(req, res) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.status(200 /* code.OK */).json(response_messages_types_1.AuthMessages.LogoutSuccess);
        }
        catch (error) {
            console.error('Logout error:', error);
            res.status(500 /* code.INTERNAL_SERVER_ERROR */).json(response_messages_types_1.AuthMessages.LogoutFailed);
        }
    }
    async getNotifications(req, res) {
        if (!req.currentUser) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.Unauthorized,
            });
            return;
        }
        const notifications = await this._notificationService.getNotificationsByRecipient(req.currentUser.id);
        res.status(200 /* code.OK */).json(notifications);
    }
    async markNotificationAsRead(req, res) {
        const { id } = req.params;
        await this._notificationService.markAsRead(id);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.NotificationMarkedRead,
        });
    }
    async markAllNotificationsAsRead(req, res) {
        if (!req.currentUser) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.Unauthorized,
            });
            return;
        }
        await this._notificationService.markAllAsRead(req.currentUser.id);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.AllNotificationsMarkedRead,
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.AuthService)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationService)),
    __metadata("design:paramtypes", [Object, Object])
], UserController);
//# sourceMappingURL=user.controller.js.map