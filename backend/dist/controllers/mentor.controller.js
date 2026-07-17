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
exports.MentorController = void 0;
const inversify_key_types_1 = require("@/config/inversify-key.types");
const inversify_1 = require("inversify");
const response_messages_types_1 = require("@/types/response-messages.types");
const mentorRequest_dto_1 = require("@/dto/mentorRequest.dto");
let MentorController = class MentorController {
    _mentorAuthService;
    _mentorService;
    _notificationService;
    constructor(_mentorAuthService, _mentorService, _notificationService) {
        this._mentorAuthService = _mentorAuthService;
        this._mentorService = _mentorService;
        this._notificationService = _notificationService;
    }
    async mentorRegisterInit(req, res) {
        const result = await this._mentorAuthService.mentorRegisterInit(req.body);
        res.status(200 /* code.OK */).json({
            ...result,
            message: response_messages_types_1.AuthMessages.OtpSuccess,
        });
    }
    async menotrRegisterVerify(req, res) {
        const { accessToken, refreshToken, user } = await this._mentorAuthService.mentorRegisterVerify(req.body);
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
    async login(req, res) {
        const result = await this._mentorAuthService.mentorLogin(req.body);
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
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new Error(response_messages_types_1.AuthMessages.InvalidRefreshToken);
            }
            await this._mentorAuthService.logout();
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.status(200 /* code.OK */).json(response_messages_types_1.AuthMessages.LogoutSuccess);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.CommonMessages.UnexpectedError;
            console.error('Logout error:', message);
            res.status(500 /* code.INTERNAL_SERVER_ERROR */).json(response_messages_types_1.AuthMessages.LogoutFailed);
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.currentUser)
                throw new Error(response_messages_types_1.ErrorMessages.UserContextMissing);
            const userId = req.currentUser.id;
            const mentor = await this._mentorService.getMentorProfile(userId);
            res.status(200 /* code.OK */).json({ mentor });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.CommonMessages.UnexpectedError;
            res.status(404 /* code.NOT_FOUND */).json({ message });
        }
    }
    async updateProfileBasicInfo(req, res) {
        try {
            if (!req.currentUser)
                throw new Error(response_messages_types_1.ErrorMessages.UserContextMissing);
            const userId = req.currentUser.id;
            const updateDto = new mentorRequest_dto_1.UpdateMentorProfileDto();
            Object.assign(updateDto, req.body);
            const updatedMentor = await this._mentorService.updateMentorProfileBasicInfo(userId, updateDto);
            res.status(200 /* code.OK */).json({ mentor: updatedMentor });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.GeneralUpdateFailed;
            res.status(400 /* code.BAD_REQUEST */).json({ message });
        }
    }
    async updateProfileMedia(req, res) {
        try {
            if (!req.currentUser)
                throw new Error(response_messages_types_1.ErrorMessages.UserContextMissing);
            const userId = req.currentUser.id;
            const updatedMentor = await this._mentorService.updateMentorProfileMedia(userId, req.files);
            res.status(200 /* code.OK */).json({ mentor: updatedMentor });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.MediaUpdateFailed;
            res.status(400 /* code.BAD_REQUEST */).json({ message });
        }
    }
    async updateProfileArray(req, res) {
        try {
            if (!req.currentUser)
                throw new Error(response_messages_types_1.ErrorMessages.UserContextMissing);
            const userId = req.currentUser.id;
            const { field, data } = req.body;
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            console.log(data, parsedData);
            const updatedMentor = await this._mentorService.updateMentorProfileArray(userId, field, parsedData);
            res.status(200 /* code.OK */).json({ mentor: updatedMentor });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.ArrayUpdateFailed;
            res.status(400 /* code.BAD_REQUEST */).json({ message });
        }
    }
    async getApprovedMentors(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const sort = req.query.sort || '';
            const filters = {};
            if (req.query.expertise) {
                filters.expertise = {
                    $regex: req.query.expertise,
                    $options: 'i',
                };
            }
            if (req.query.minPrice || req.query.maxPrice) {
                filters.monthlyCharge = {};
                if (req.query.minPrice)
                    filters.monthlyCharge.$gte = parseInt(req.query.minPrice);
                if (req.query.maxPrice)
                    filters.monthlyCharge.$lte = parseInt(req.query.maxPrice);
            }
            if (req.query.rating) {
                filters.rating = {
                    $gte: parseFloat(req.query.rating),
                };
            }
            const result = await this._mentorService.getApprovedMentors(page, limit, search, sort, filters);
            res.status(200 /* code.OK */).json(result);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to fetch mentors';
            res.status(500 /* code.INTERNAL_SERVER_ERROR */).json({
                message: response_messages_types_1.ErrorMessages.FetchMentorsFailed,
            });
            console.log(message);
        }
    }
    async getMentorById(req, res) {
        try {
            const { id } = req.params;
            const mentor = await this._mentorService.getMentorById(id);
            if (!mentor) {
                res.status(404 /* code.NOT_FOUND */).json({
                    message: response_messages_types_1.ErrorMessages.MentorNotFound,
                });
                return;
            }
            res.status(200 /* code.OK */).json({ mentor });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Failed to fetch mentor';
            res.status(500 /* code.INTERNAL_SERVER_ERROR */).json({ message });
        }
    }
    async resendOtp(req, res) {
        try {
            const result = await this._mentorAuthService.mentorResendOtp(req.body);
            res.status(200 /* code.OK */).json(result);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.ResendOtpFailed;
            res.status(400 /* code.BAD_REQUEST */).json({ message });
        }
    }
    async forgotPassword(req, res) {
        try {
            const result = await this._mentorAuthService.mentorForgotPassword(req.body);
            res.status(200 /* code.OK */).json(result);
        }
        catch (error) {
            console.error('Mentor forgot password error:', error);
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.ForgotPasswordFailed;
            res.status(400 /* code.BAD_REQUEST */).json({ message });
        }
    }
    async resetPassword(req, res) {
        try {
            const result = await this._mentorAuthService.mentorResetPassword(req.body);
            res.status(200 /* code.OK */).json(result);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.ResetPasswordFailed;
            res.status(400 /* code.BAD_REQUEST */).json({ message });
        }
    }
    async googleLogin(req, res) {
        try {
            const result = await this._mentorAuthService.mentorLoginWithGoogle(req.body);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: true,
            });
            res.status(200 /* code.OK */).json(result);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.GoogleLoginFailed;
            res.status(400 /* code.BAD_REQUEST */).json({ message });
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
exports.MentorController = MentorController;
exports.MentorController = MentorController = __decorate([
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorAuthService)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorService)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MentorController);
//# sourceMappingURL=mentor.controller.js.map