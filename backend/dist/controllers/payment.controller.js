"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let PaymentController = class PaymentController {
    _paymentService;
    constructor(_paymentService) {
        this._paymentService = _paymentService;
    }
    async createMentorshipSession(req, res) {
        const { mentorshipId, successUrl, cancelUrl } = req.body;
        const sessionUrl = await this._paymentService.createMentorshipCheckoutSession(mentorshipId, successUrl, cancelUrl);
        res.status(200 /* code.OK */).json(sessionUrl);
    }
    async verifyCheckoutSession(req, res) {
        const { sessionId } = req.params;
        const result = await this._paymentService.verifyCheckoutSession(sessionId);
        res.status(200 /* code.OK */).json(result);
    }
    async handleWebhook(req, res) {
        try {
            const sig = req.headers['stripe-signature'];
            const rawBody = req.body;
            await this._paymentService.handleWebhookEvent(rawBody, sig);
            res.status(200 /* code.OK */).send({ received: true });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : response_messages_types_1.ErrorMessages.WebhookError;
            res.status(400 /* code.BAD_REQUEST */).send(`Webhook Error: ${message}`);
            console.error(error);
        }
    }
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PaymentService)),
    __metadata("design:paramtypes", [Object])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map