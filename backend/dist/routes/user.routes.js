"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const express_1 = require("express");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const role_types_1 = require("@/types/role.types");
const multer_config_1 = require("@/config/multer.config");
const inversify_config_1 = require("@/config/inversify.config");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
function authRoutes(userController) {
    const router = (0, express_1.Router)();
    const _tokenService = inversify_config_1.container.get(inversify_key_types_1.TYPES.TokenService);
    router.post('/login', userController.login.bind(userController));
    router.post('/logout', userController.logout.bind(userController));
    router.post('/google-login', (0, asyncWrapper_1.asyncWrapper)(userController.googleAuth.bind(userController)));
    router.post('/refresh', userController.refreshTokenHandler.bind(userController));
    router.post('/register/init', (0, asyncWrapper_1.asyncWrapper)(userController.registerInit.bind(userController)));
    router.post('/register/verify', (0, asyncWrapper_1.asyncWrapper)(userController.registerVerify.bind(userController)));
    router.post('/register/resend-otp', (0, asyncWrapper_1.asyncWrapper)(userController.resendOtp.bind(userController)));
    router.post('/forgot-password/init', (0, asyncWrapper_1.asyncWrapper)(userController.forgotPassword.bind(userController)));
    router.post('/forgot-password/verify', (0, asyncWrapper_1.asyncWrapper)(userController.resetPassword.bind(userController)));
    router.patch('/profile/:id', (0, authenticate_and_authorize_1.default)(_tokenService, role_types_1.Role.User), userController.updateUserProfile.bind(userController));
    router.patch('/profile/picture/:id', (0, authenticate_and_authorize_1.default)(_tokenService, role_types_1.Role.User), multer_config_1.upload.single('image'), userController.updateProfilePic.bind(userController));
    router.patch('/password', (0, authenticate_and_authorize_1.default)(_tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(userController.updatePassword.bind(userController)));
    router.get('/notifications', (0, authenticate_and_authorize_1.default)(_tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(userController.getNotifications.bind(userController)));
    router.patch('/notifications/:id/mark-read', (0, authenticate_and_authorize_1.default)(_tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(userController.markNotificationAsRead.bind(userController)));
    router.patch('/notifications/mark-all-read', (0, authenticate_and_authorize_1.default)(_tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(userController.markAllNotificationsAsRead.bind(userController)));
    return router;
}
//# sourceMappingURL=user.routes.js.map