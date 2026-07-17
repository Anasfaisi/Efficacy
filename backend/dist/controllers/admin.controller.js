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
exports.AdminController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
const request_dto_1 = require("@/dto/request.dto");
let AdminController = class AdminController {
    _adminAuthService;
    _notificationService;
    _adminService;
    _authService;
    _walletService;
    constructor(_adminAuthService, _notificationService, _adminService, _authService, _walletService) {
        this._adminAuthService = _adminAuthService;
        this._notificationService = _notificationService;
        this._adminService = _adminService;
        this._authService = _authService;
        this._walletService = _walletService;
    }
    async getNotifications(req, res) {
        const notifications = await this._notificationService.getNotificationsByRecipient('admin_global');
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
        await this._notificationService.markAllAsRead('admin_global');
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.AllNotificationsMarkedRead,
        });
    }
    async getMentorApplications(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || 'all';
        const mentorType = req.query.mentorType || 'all';
        const applications = await this._adminService.getMentorApplications(page, limit, search, { status, mentorType });
        res.status(200 /* code.OK */).json(applications);
    }
    async getMentorApplicationById(req, res) {
        const { id } = req.params;
        const application = await this._adminService.getMentorApplicationById(id);
        if (!application) {
            res.status(404 /* code.NOT_FOUND */).json({
                message: response_messages_types_1.ErrorMessages.ApplicationNotFound,
            });
            return;
        }
        res.status(200 /* code.OK */).json(application);
    }
    async approveMentorApplication(req, res) {
        const { id } = req.params;
        await this._adminService.approveMentorApplication(id);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.ApplicationApproved,
        });
    }
    async rejectMentorApplication(req, res) {
        const { id } = req.params;
        const { reason } = req.body;
        await this._adminService.rejectMentorApplication(id, reason);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.ApplicationRejected,
        });
    }
    async requestChangesMentorApplication(req, res) {
        const { id } = req.params;
        const { reason } = req.body;
        await this._adminService.requestChangesMentorApplication(id, reason);
        res.status(200 /* code.OK */).json({ message: response_messages_types_1.SuccessMessages.ChangesRequested });
    }
    async adminLogin(req, res) {
        const response = await this._adminAuthService.adminLogin(req.body);
        res.cookie('refreshToken', response.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('accessToken', response.accessToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.AdminLoginSuccess,
            admin: response.admin,
        });
    }
    async refreshTokenHandler(req, res) {
        try {
            const token = req.cookies.refreshToken;
            if (!token) {
                throw new Error('Last Session expired, Please login again');
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
            res.json({ success: true });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.TokenRefreshFailed;
            res.status(401 /* code.UNAUTHORIZED */).json({ message });
        }
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
    async getAllMentors(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || 'all';
        const mentorType = req.query.mentorType || 'all';
        const mentors = await this._adminService.getAllMentors(page, limit, search, { status, mentorType });
        res.status(200 /* code.OK */).json(mentors);
    }
    async getMentorById(req, res) {
        const id = req.currentUser?.id;
        if (!id) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.ErrorMessages.UserNotFound,
            });
            return;
        }
        const mentor = await this._adminService.getMentorById(id);
        if (!mentor) {
            res.status(404 /* code.NOT_FOUND */).json({
                message: response_messages_types_1.ErrorMessages.MentorNotFound,
            });
            return;
        }
        res.status(200 /* code.OK */).json(mentor);
    }
    async updateMentorStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        await this._adminService.updateMentorStatus(id, status);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.MentorStatusUpdated,
        });
    }
    async getAllUsers(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const result = await this._adminService.getAllUsers(page, limit, search);
        res.status(200 /* code.OK */).json(result);
    }
    async updateUserStatus(req, res) {
        const id = req.params.id;
        const { isActive } = req.body;
        const dto = new request_dto_1.UpdateUserStatusRequestDto(id, isActive);
        await this._adminService.updateUserStatus(dto);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.UserStatusUpdated,
        });
    }
    async getRevenueData(req, res) {
        const id = req.currentUser?.id;
        const revenue = await this._adminService.getRevenueDetails(id);
        res.status(200 /* code.OK */).json(revenue);
    }
    async getTransactions(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = req.query.filter || 'all';
        const transactions = await this._adminService.getAllTransactions(page, limit, filter);
        res.status(200 /* code.OK */).json(transactions);
    }
    async getDashboardStats(req, res) {
        const id = req.currentUser?.id;
        if (!id) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.ErrorMessages.UserNotFound,
            });
            return;
        }
        const stats = await this._adminService.getDashboardStats(id);
        res.status(200 /* code.OK */).json(stats);
    }
    async approveWithdrawal(req, res) {
        const { walletId, transactionId } = req.params;
        const wallet = await this._walletService.approveWithdrawal(walletId, transactionId);
        res.status(200 /* code.OK */).json({
            message: 'Payout approved and Stripe Express Transfer completed successfully.',
            wallet,
        });
    }
    async rejectWithdrawal(req, res) {
        const { walletId, transactionId } = req.params;
        const wallet = await this._walletService.rejectWithdrawal(walletId, transactionId);
        res.status(200 /* code.OK */).json({
            message: 'Payout request rejected and funds returned to mentor balance.',
            wallet,
        });
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.AdminAuthService)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationService)),
    __param(2, (0, inversify_1.inject)(inversify_key_types_1.TYPES.AdminService)),
    __param(3, (0, inversify_1.inject)(inversify_key_types_1.TYPES.AuthService)),
    __param(4, (0, inversify_1.inject)(inversify_key_types_1.TYPES.WalletService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AdminController);
//# sourceMappingURL=admin.controller.js.map