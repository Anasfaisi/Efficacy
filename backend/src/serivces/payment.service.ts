import { injectable, inject } from 'inversify';
import Stripe from 'stripe';
import { TYPES } from '@/config/inversify-key.types';
import { IPaymentService } from './Interfaces/IPayment.service';
import { RequestPaymentDto } from '@/dto/request.dto';
import { ResponsePaymentDto } from '@/dto/response.dto';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { IMentorshipService } from './Interfaces/IMentorship.service';
import { ErrorMessages } from '@/types/response-messages.types';
import { IMentorship } from '@/models/Mentorship.model';
import { MentorEntity } from '@/entity/mentor.entity';
import { UserEntity } from '@/entity/user.entity';

@injectable()
export class PaymentService implements IPaymentService {
    private _stripe: Stripe;
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.MentorshipService)
        private _mentorshipService: IMentorshipService
    ) {
        this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-08-27.basil',
        });
    }

    // async createCheckoutSession(
    //     dto: RequestPaymentDto
    // ): Promise<ResponsePaymentDto> {
    //     const session = await this._stripe.checkout.sessions.create({
    //         payment_method_types: ['card'],
    //         mode: 'subscription',
    //         line_items: [{ price: dto.priceId, quantity: 1 }],
    //         success_url: dto.successUrl,
    //         cancel_url: dto.cancelUrl,
    //         customer_email: (await this._userRepository.findById(dto.userId))
    //             ?.email,
    //     });
    //     return new ResponsePaymentDto(session.id, session.url!);
    // }

    async verifyCheckoutSession(
        sessionId: string
    ): Promise<ResponsePaymentDto> {
        const session =
            await this._stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.payment_status !== 'paid') {
            throw new Error(ErrorMessages.InvalidCheckoutSession);
        }
        return new ResponsePaymentDto(session.id, session.url!);
    }

    async createMentorshipCheckoutSession(
        mentorshipId: string,
        successUrl: string,
        cancelUrl: string
    ): Promise<ResponsePaymentDto> {
        const mentorship =
            await this._mentorshipService.getMentorshipById(mentorshipId);
        if (!mentorship) throw new Error(ErrorMessages.MentorshipNotFound);

        const session = await this._stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Mentorship Session',
                            description: `1 Month Mentorship with ${((mentorship.mentorId as unknown as MentorEntity).id || mentorship.mentorId).toString()}`,
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
            customer_email: (
                await this._userRepository.findById(
                    (
                        (mentorship.userId as unknown as UserEntity).id || mentorship.userId
                    ).toString()
                )
            )?.email,
        });

        return new ResponsePaymentDto(session.id, session.url!);
    }

    async handleWebhookEvent(
        rawBody: Buffer,
        signature: string
    ): Promise<void> {
        let event: Stripe.Event;

        try {
            event = this._stripe.webhooks.constructEvent(
                rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
                `${ErrorMessages.WebhookSignatureFailed}: ${message}`
            );
            throw new Error(
                `${ErrorMessages.WebhookSignatureFailed}: ${message}`
            );
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            if (session.metadata?.type === 'mentorship_payment') {
                if (session.metadata.mentorshipId) {
                    await this._mentorshipService.verifyPayment(
                        session.metadata.mentorshipId,
                        session.id
                    );
                }
            } else if (session.mode === 'subscription') {
                const subscriptionId = session.subscription as string;
                const customerEmail = session.customer_email;

                const subscription =
                    await this._stripe.subscriptions.retrieve(subscriptionId);

                const startDate = new Date();
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 7);
                await this._userRepository.updateSubscriptionByEmail(
                    customerEmail!,
                    {
                        id: subscriptionId,
                        status: subscription.status as any,
                        priceId: subscription.items.data[0]?.price?.id,
                        current_period_end: endDate,
                    }
                );
            }
        }
    }

    async transferToConnectAccount(accountId: string, amount: number): Promise<string> {
        const transfer = await this._stripe.transfers.create({
            amount: Math.round(amount * 100), // Convert INR rupees to paise (cents)
            currency: 'inr',
            destination: accountId,
        });
        return transfer.id;
    }

    async refundStripePayment(sessionId: string, amount: number): Promise<string> {
        const session = await this._stripe.checkout.sessions.retrieve(sessionId);
        const paymentIntentId = session.payment_intent as string;

        if (!paymentIntentId) {
            throw new Error("No Payment Intent found for this session.");
        }

        const refund = await this._stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: Math.round(amount * 100), // Convert to paise
        });

        return refund.id;
    }
}

