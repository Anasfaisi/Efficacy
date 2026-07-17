"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KanbanRoutes;
const inversify_config_1 = require("@/config/inversify.config");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const inversify_key_types_1 = require("@/config/inversify-key.types");
const role_types_1 = require("@/types/role.types");
const express_1 = require("express");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
function KanbanRoutes(kanbanController) {
    const router = (0, express_1.Router)();
    const tokenService = inversify_config_1.container.get(inversify_key_types_1.TYPES.TokenService);
    router.post('/board', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(kanbanController.getKanbanBoard.bind(kanbanController)));
    router.post('/task/add', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), kanbanController.addKanbanTask.bind(kanbanController));
    router.put('/task', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), kanbanController.updateKanbanTask.bind(kanbanController));
    router.delete('/task/delete/:id', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), kanbanController.deleteKanbanTask.bind(kanbanController));
    router.put('/task/reorder', (0, authenticate_and_authorize_1.default)(tokenService, role_types_1.Role.User), kanbanController.reorderKanbanTask.bind(kanbanController));
    return router;
}
//# sourceMappingURL=Kanban.routes.js.map