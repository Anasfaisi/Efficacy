"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mentorRoutes;
const express_1 = require("express");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
const multer_config_1 = require("@/config/multer.config");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const role_types_1 = require("@/types/role.types");
const inversify_config_1 = require("@/config/inversify.config");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const validate_request_1 = require("@/middleware/validate-request");
const mentor_validator_1 = require("@/validators/mentor.validator");
function mentorRoutes(mentorController, mentorOnboardController) {
    const router = (0, express_1.Router)();
    const tokenService = inversify_config_1.container.get(inversify_key_types_1.TYPES.TokenService);
    router.post('/login', (0, asyncWrapper_1.asyncWrapper)(mentorController.login.bind(mentorController)));
    router.post('/logout', mentorController.logout.bind(mentorController));
    router.post('/register/init', (0, asyncWrapper_1.asyncWrapper)(mentorController.mentorRegisterInit.bind(mentorController)));
    router.post('/resend-otp', (0, asyncWrapper_1.asyncWrapper)(mentorController.resendOtp.bind(mentorController)));
    router.post('/forgot-password', (0, asyncWrapper_1.asyncWrapper)(mentorController.forgotPassword.bind(mentorController)));
    router.post('/reset-password', (0, asyncWrapper_1.asyncWrapper)(mentorController.resetPassword.bind(mentorController)));
    router.post('/google-login', (0, asyncWrapper_1.asyncWrapper)(mentorController.googleLogin.bind(mentorController)));
    router.post('/register/verify', (0, asyncWrapper_1.asyncWrapper)(mentorController.menotrRegisterVerify.bind(mentorController)));
    router.post('/application/init', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), multer_config_1.upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'certificate', maxCount: 1 },
        { name: 'idProof', maxCount: 1 },
    ]), (0, validate_request_1.validateRequest)(mentor_validator_1.mentorApplicationSchema), (0, asyncWrapper_1.asyncWrapper)(mentorOnboardController.mentorApplicationInit.bind(mentorOnboardController)));
    router.post('/activate', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorOnboardController.activateMentor.bind(mentorOnboardController)));
    router.get('/profile', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorController.getProfile.bind(mentorController)));
    router.patch('/profile/basic-info', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, validate_request_1.validateRequest)(mentor_validator_1.updateMentorProfileSchema), (0, asyncWrapper_1.asyncWrapper)(mentorController.updateProfileBasicInfo.bind(mentorController)));
    router.patch('/profile/media', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), multer_config_1.upload.fields([
        { name: 'profilePic', maxCount: 1 },
        { name: 'coverPic', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'certificate', maxCount: 1 },
        { name: 'idProof', maxCount: 1 },
    ]), (0, validate_request_1.validateRequest)(mentor_validator_1.updateMentorProfileSchema), (0, asyncWrapper_1.asyncWrapper)(mentorController.updateProfileMedia.bind(mentorController)));
    router.patch('/profile/array', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, validate_request_1.validateRequest)(mentor_validator_1.updateMentorProfileSchema), (0, asyncWrapper_1.asyncWrapper)(mentorController.updateProfileArray.bind(mentorController)));
    router.get('/list/approved', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorController.getApprovedMentors.bind(mentorController)));
    router.get('/notifications', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorController.getNotifications.bind(mentorController)));
    router.patch('/notifications/:id/mark-read', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorController.markNotificationAsRead.bind(mentorController)));
    router.patch('/notifications/mark-all-read', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorController.markAllNotificationsAsRead.bind(mentorController)));
    router.get('/:id', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorController.getMentorById.bind(mentorController)));
    return router;
}
//# sourceMappingURL=mentor.routes.js.map