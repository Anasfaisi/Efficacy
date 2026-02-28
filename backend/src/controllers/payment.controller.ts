import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IPaymentService } from '@/serivces/Interfaces/IPayment.service';
import { TYPES } from '@/config/inversify-key.types';
import code from '@/types/http-status.enum';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class PaymentController {
    constructor(
        @inject(TYPES.PaymentService) private _paymentService: IPaymentService
    ) {}

    async createMentorshipSession(req: Request, res: Response) {
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
            const sig = req.headers['stripe-signature'] as string;
            const rawBody = req.body;

            await this._paymentService.handleWebhookEvent(rawBody, sig);

            res.status(code.OK).send({ received: true });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : ErrorMessages.WebhookError;
            res.status(code.BAD_REQUEST).send(`Webhook Error: ${message}`);
            console.error(error);
        }
    }
}
