"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BadgeRoutes;
const express_1 = require("express");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const role_types_1 = require("@/types/role.types");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
function BadgeRoutes(badgeController, tokenService) {
    const router = (0, express_1.Router)();
    router.post('/', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(badgeController.CreateBadge.bind(badgeController)));
    router.get('/', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin, role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(badgeController.getAllBadges.bind(badgeController)));
    router.get('/user', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(badgeController.getUserBadges.bind(badgeController)));
    router.get('/:badgeId', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(badgeController.getBadgeById.bind(badgeController)));
    router.put('/:badgeId', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(badgeController.updateBadge.bind(badgeController)));
    router.patch('/:badgeId/toggle-status', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Admin]), (0, asyncWrapper_1.asyncWrapper)(badgeController.toggleBadgeStatus.bind(badgeController)));
    return router;
}
//# sourceMappingURL=badge.routes.js.map