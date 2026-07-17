"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reviewRoutes;
const express_1 = require("express");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
const inversify_config_1 = require("@/config/inversify.config");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const role_types_1 = require("@/types/role.types");
function reviewRoutes(reviewController) {
    const router = (0, express_1.Router)();
    const tokenService = inversify_config_1.container.get(inversify_key_types_1.TYPES.TokenService);
    router.post('/', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(reviewController.submitReview.bind(reviewController)));
    router.get('/mentor/:mentorId', (0, asyncWrapper_1.asyncWrapper)(reviewController.getMentorReviews.bind(reviewController)));
    return router;
}
//# sourceMappingURL=review.routes.js.map