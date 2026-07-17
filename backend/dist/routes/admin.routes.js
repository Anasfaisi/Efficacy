"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminRoutes;
const express_1 = __importDefault(require("express"));
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const role_types_1 = require("@/types/role.types");
const token_service_1 = require("@/services/token.service");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
function adminRoutes(adminController) {
    const router = express_1.default.Router();
    const tokenService = new token_service_1.TokenService();
    router.post('/login', (0, asyncWrapper_1.asyncWrapper)(adminController.adminLogin.bind(adminController)));
    router.post('/logout', adminController.logout.bind(adminController));
    router.post('/refresh-token', adminController.refreshTokenHandler.bind(adminController));
    router.get('/notifications', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getNotifications.bind(adminController)));
    router.patch('/notifications/:id/mark-read', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.markNotificationAsRead.bind(adminController)));
    router.patch('/notifications/mark-all-read', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.markAllNotificationsAsRead.bind(adminController)));
    router.get('/mentors/applications', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getMentorApplications.bind(adminController)));
    router.get('/mentors/applications/:id', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getMentorApplicationById.bind(adminController)));
    router.post('/mentors/applications/:id/approve', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.approveMentorApplication.bind(adminController)));
    router.post('/mentors/applications/:id/reject', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.rejectMentorApplication.bind(adminController)));
    router.post('/mentors/applications/:id/request-changes', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.requestChangesMentorApplication.bind(adminController)));
    router.get('/mentors', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getAllMentors.bind(adminController)));
    router.get('/mentors/:id', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getMentorById.bind(adminController)));
    router.put('/mentors/:id/status', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.updateMentorStatus.bind(adminController)));
    router.get('/users', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getAllUsers.bind(adminController)));
    router.patch('/users/:id/status', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.updateUserStatus.bind(adminController)));
    router.get('/revenue', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getRevenueData.bind(adminController)));
    router.get('/transactions', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getTransactions.bind(adminController)));
    router.get('/dashboard-stats', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.getDashboardStats.bind(adminController)));
    router.post('/withdrawals/:walletId/transactions/:transactionId/approve', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.approveWithdrawal.bind(adminController)));
    router.post('/withdrawals/:walletId/transactions/:transactionId/reject', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(adminController.rejectWithdrawal.bind(adminController)));
    return router;
}
//# sourceMappingURL=admin.routes.js.map