"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = chatRoutes;
const express_1 = require("express");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const inversify_config_1 = require("@/config/inversify.config");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const role_types_1 = require("@/types/role.types");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
const multer_config_1 = require("@/config/multer.config");
function chatRoutes(chatController) {
    const router = (0, express_1.Router)();
    const tokenService = inversify_config_1.container.get(inversify_key_types_1.TYPES.TokenService);
    router.post('/initiate', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(chatController.initiateChat.bind(chatController)));
    router.get('/my-conversations', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(chatController.getUserConversations.bind(chatController)));
    // router.get(
    //     '/:roomId/messages',
    //     authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
    //     asyncWrapper(chatController.getRoomMessages.bind(chatController))
    // );
    router.post('/upload', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), multer_config_1.upload.single('file'), (0, asyncWrapper_1.asyncWrapper)(chatController.uploadFile.bind(chatController)));
    router.delete('/messages/:messageId', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(chatController.deleteMessage.bind(chatController)));
    return router;
}
//# sourceMappingURL=chat.routes.js.map