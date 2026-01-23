import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IPaymentService } from '@/serivces/Interfaces/IPayment.service';
import { TYPES } from '@/config/inversify-key.types';
import code from '@/types/http-status.enum';

@injectable()
export class PaymentController {
    constructor(
        @inject(TYPES.PaymentService) private _paymentService: IPaymentService
    ) {}

    // async createCheckoutSession(req: Request, res: Response) {
    //     const { userId, priceId, successUrl, cancelUrl } = req.body;
    //     const sessionUrl = await this._paymentService.createCheckoutSession({
    //         userId,
    //         priceId,
    //         successUrl,
    //         cancelUrl,
    //     });
    //     res.status(code.OK).json(sessionUrl);
    //     console.log('session url passed');
    // }

    async createMentorshipSession(req: Request, res: Response) {
        console.log(this?._paymentService, 'payment service');
        console.log(
            this,
            ' this also, it is reaching in create mentorship session'
        );
        console.log('reaching in create mentorship session');
        const { mentorshipId, successUrl, cancelUrl } = req.body;
        const sessionUrl =
            await this._paymentService.createMentorshipCheckoutSession(
                mentorshipId,
                successUrl,
                cancelUrl
            );
        res.status(code.OK).json(sessionUrl);
    }

    async verifyCheckoutSession(req: Request, res: Response) {
        const { sessionId } = req.params;

        const result =
            await this._paymentService.verifyCheckoutSession(sessionId);

        res.status(code.OK).json(result);
    }

    async handleWebhook(req: Request, res: Response) {
        try {
            console.log(this?._paymentService, 'payment service');
            console.log(this, ' this also, it is reaching in handle web hook');
            const sig = req.headers['stripe-signature'] as string;
            const rawBody = req.body;

            await this._paymentService.handleWebhookEvent(rawBody, sig);

            res.status(code.OK).send({ received: true });
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Webhook error';
            res.status(code.BAD_REQUEST).send(`Webhook Error: ${message}`);
            console.error(error);
        }
    }
}
