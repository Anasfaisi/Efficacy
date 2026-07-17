"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = planRoutes;
const express_1 = require("express");
function planRoutes(planController) {
    const router = (0, express_1.Router)();
    router.post('/create', planController.createPlan.bind(planController));
    router.get('/all', planController.getAllPlans.bind(planController));
    router.get('/:planId', planController.getPlanById.bind(planController));
    router.put('/:planId', planController.updatePlan.bind(planController));
    router.delete('/:planId', planController.deletePlan.bind(planController));
    return router;
}
//# sourceMappingURL=plan.routes.js.map