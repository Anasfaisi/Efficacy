"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = noteRoutes;
const express_1 = require("express");
const authenticate_and_authorize_1 = __importDefault(require("../middleware/authenticate-and-authorize"));
const inversify_config_1 = require("../config/inversify.config");
const inversify_key_types_1 = require("../config/inversify-key.types");
const role_types_1 = require("../types/role.types");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
function noteRoutes(noteController) {
    const router = (0, express_1.Router)();
    const tokenService = inversify_config_1.container.get(inversify_key_types_1.TYPES.TokenService);
    const authMiddleware = (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User);
    router.post('/', authMiddleware, (0, asyncWrapper_1.asyncWrapper)(noteController.createNote.bind(noteController)));
    router.get('/', authMiddleware, (0, asyncWrapper_1.asyncWrapper)(noteController.getNotes.bind(noteController)));
    router.put('/:id', authMiddleware, (0, asyncWrapper_1.asyncWrapper)(noteController.updateNote.bind(noteController)));
    router.delete('/:id', authMiddleware, (0, asyncWrapper_1.asyncWrapper)(noteController.deleteNote.bind(noteController)));
    return router;
}
//# sourceMappingURL=note.routes.js.map