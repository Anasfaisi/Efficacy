"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mentorshipRoutes;
const express_1 = require("express");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const inversify_config_1 = require("@/config/inversify.config");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const role_types_1 = require("@/types/role.types");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
function mentorshipRoutes(mentorshipController) {
    const router = (0, express_1.Router)();
    const tokenService = inversify_config_1.container.get(inversify_key_types_1.TYPES.TokenService);
    router.post('/request', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.createRequest.bind(mentorshipController)));
    router.get('/requests/mentor', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.Mentor), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.getMentorRequests.bind(mentorshipController)));
    router.get('/requests/user', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.getUserRequests.bind(mentorshipController)));
    router.patch('/request/:id/respond', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.Mentor), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.respondToRequest.bind(mentorshipController)));
    router.patch('/request/:id/confirm', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.confirmSuggestion.bind(mentorshipController)));
    router.post('/request/:id/verify-payment', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.verifyPayment.bind(mentorshipController)));
    router.get('/active', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.getActiveMentorship.bind(mentorshipController)));
    router.get('/:id', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.getMentorshipById.bind(mentorshipController)));
    router.post('/:id/book-session', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.bookSession.bind(mentorshipController)));
    router.post('/:id/reschedule-session', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.rescheduleSession.bind(mentorshipController)));
    router.post('/:id/complete', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.completeMentorship.bind(mentorshipController)));
    router.post('/:id/feedback', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.submitFeedback.bind(mentorshipController)));
    router.post('/:id/cancel', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(mentorshipController.cancelMentorship.bind(mentorshipController)));
    return router;
}
//# sourceMappingURL=mentorship.routes.js.map