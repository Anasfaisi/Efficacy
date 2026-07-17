"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlannerTaskRoutes;
const inversify_config_1 = require("@/config/inversify.config");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const inversify_key_types_1 = require("@/config/inversify-key.types");
const role_types_1 = require("@/types/role.types");
const express_1 = require("express");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
function PlannerTaskRoutes(controller) {
    const router = (0, express_1.Router)();
    const tokenService = inversify_config_1.container.get(inversify_key_types_1.TYPES.TokenService);
    const auth = (0, authenticate_and_authorize_1.default)(tokenService, [
        role_types_1.Role.User,
        role_types_1.Role.Mentor,
    ]);
    router.post('/', auth, (0, asyncWrapper_1.asyncWrapper)(controller.createTask.bind(controller)));
    router.get('/', auth, (0, asyncWrapper_1.asyncWrapper)(controller.getTasks.bind(controller)));
    router.put('/:taskId', auth, (0, asyncWrapper_1.asyncWrapper)(controller.updateTask.bind(controller)));
    router.delete('/:taskId', auth, (0, asyncWrapper_1.asyncWrapper)(controller.deleteTask.bind(controller)));
    return router;
}
//# sourceMappingURL=planner-task.routes.js.map