import { injectable, inject } from 'inversify';
import Stripe from 'stripe';
import { TYPES } from '@/config/inversify-key.types';
import { IPaymentService } from './Interfaces/IPayment.service';
import { RequestPaymentDto } from '@/Dto/request.dto';
import { ResponsePaymentDto } from '@/Dto/response.dto';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { IMentorshipService } from './Interfaces/IMentorship.service';
import { IMentor } from '@/models/Mentor.model';
import { IUser } from '@/models/User.model';

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

    async createCheckoutSession(
        dto: RequestPaymentDto
    ): Promise<ResponsePaymentDto> {
        const session = await this._stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{ price: dto.priceId, quantity: 1 }],
            success_url: dto.successUrl,
            cancel_url: dto.cancelUrl,
            customer_email: (await this._userRepository.findById(dto.userId))
                ?.email,
        });
        return new ResponsePaymentDto(session.id, session.url!);
    }

    async verifyCheckoutSession(
        sessionId: string
    ): Promise<ResponsePaymentDto> {
        const session =
            await this._stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.payment_status !== 'paid') {
            throw new Error('checkout session not valid or not paid');
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
        if (!mentorship) throw new Error('Mentorship not found');

        const session = await this._stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Mentorship Session',
                            description: `1 Month Mentorship with ${(mentorship.mentorId as Partial<IMentor>).id}`, // Ideally fetch mentor name but this is sufficient for now
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
                    (mentorship.userId as Partial<IUser>).id.toString()
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
            console.error(`Webhook signature verification failed: ${message}`);
            throw new Error(
                `Webhook signature verification failed: ${message}`
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
                        status: subscription.status,
                        priceId: subscription.items.data[0]?.price?.id,
                        current_period_end: endDate,
                    }
                );
            }
        }
    }
}
