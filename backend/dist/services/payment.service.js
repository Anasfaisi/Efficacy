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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const inversify_1 = require("inversify");
const stripe_1 = __importDefault(require("stripe"));
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_dto_1 = require("@/dto/response.dto");
const response_messages_types_1 = require("@/types/response-messages.types");
const subscription_model_1 = require("@/models/subscription.model");
let PaymentService = class PaymentService {
    _userRepository;
    _mentorshipService;
    _stripe;
    constructor(_userRepository, _mentorshipService) {
        this._userRepository = _userRepository;
        this._mentorshipService = _mentorshipService;
        this._stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-08-27.basil',
        });
    }
    async verifyCheckoutSession(sessionId) {
        const session = await this._stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.payment_status !== 'paid') {
            throw new Error(response_messages_types_1.ErrorMessages.InvalidCheckoutSession);
        }
        return new response_dto_1.ResponsePaymentDto(session.id, session.url);
    }
    async createMentorshipCheckoutSession(mentorshipId, successUrl, cancelUrl) {
        const mentorship = await this._mentorshipService.getMentorshipById(mentorshipId);
        if (!mentorship)
            throw new Error(response_messages_types_1.ErrorMessages.MentorshipNotFound);
        const session = await this._stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Mentorship Session',
                            description: `1 Month Mentorship with ${(mentorship.mentorId.id || mentorship.mentorId).toString()}`,
                        },
                        unit_amount: mentorship.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                mentorshipId,
                type: 'mentorship_payment',
            },
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: (await this._userRepository.findById((mentorship.userId.id ||
                mentorship.userId).toString()))?.email,
        });
        return new response_dto_1.ResponsePaymentDto(session.id, session.url);
    }
    async handleWebhookEvent(rawBody, signature) {
        let event;
        try {
            event = this._stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`${response_messages_types_1.ErrorMessages.WebhookSignatureFailed}: ${message}`);
            throw new Error(`${response_messages_types_1.ErrorMessages.WebhookSignatureFailed}: ${message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            if (session.metadata?.type === 'mentorship_payment') {
                if (session.metadata.mentorshipId) {
                    await this._mentorshipService.verifyPayment(session.metadata.mentorshipId, session.id);
                }
            }
            else if (session.mode === 'subscription') {
                const subscriptionId = session.subscription;
                const customerEmail = session.customer_email;
                const startDate = new Date();
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 7);
                await this._userRepository.updateSubscriptionByEmail(customerEmail, {
                    stripeSubscriptionId: subscriptionId,
                    status: subscription_model_1.SubscriptionStatus.ACTIVE,
                    currentPeriodEnd: endDate,
                });
            }
        }
    }
    async transferToConnectAccount(accountId, amount) {
        const transfer = await this._stripe.transfers.create({
            amount: Math.round(amount * 100),
            currency: 'inr',
            destination: accountId,
        });
        return transfer.id;
    }
    async refundStripePayment(sessionId, amount) {
        const session = await this._stripe.checkout.sessions.retrieve(sessionId);
        const paymentIntentId = session.payment_intent;
        if (!paymentIntentId) {
            throw new Error('No Payment Intent found for this session.');
        }
        const refund = await this._stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: Math.round(amount * 100), // Convert to paise
        });
        return refund.id;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.MentorshipService)),
    __metadata("design:paramtypes", [Object, Object])
], PaymentService);
//# sourceMappingURL=payment.service.js.map