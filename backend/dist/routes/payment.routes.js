"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = paymentRoutes;
const express_1 = require("express");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
function paymentRoutes(paymentController) {
    const router = (0, express_1.Router)();
    router.post('/checkout-mentorship', (0, asyncWrapper_1.asyncWrapper)(paymentController.createMentorshipSession.bind(paymentController)));
    router.get('/verify/:sessionId', (0, asyncWrapper_1.asyncWrapper)(paymentController.verifyCheckoutSession.bind(paymentController)));
    return router;
}
//# sourceMappingURL=payment.routes.js.map