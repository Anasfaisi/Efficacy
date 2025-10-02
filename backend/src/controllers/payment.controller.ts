import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IPaymentService } from '@/serivces/Interfaces/IPayment.service';
import { TYPES } from '@/types/inversify-key.types';
import code from '@/types/http-status.enum';

@injectable()
export class PaymentController {
    constructor(
        @inject(TYPES.PaymentService) private _paymentService: IPaymentService
    ) {}

    async createCheckoutSession(req: Request, res: Response) {
        try {
            const { userId, priceId, successUrl, cancelUrl } = req.body;
            const sessionUrl = await this._paymentService.createCheckoutSession(
                {
                    userId,
                    priceId,
                    successUrl,
                    cancelUrl,
                }
            );
            res.status(code.OK).json(sessionUrl);
            console.log('session url passed');
        } catch (error: any) {
            console.log(error);
            res.status(code.INTERNAL_SERVER_ERROR).json({
                message: error.message,
            });
        }
    }

    async verifyCheckoutSession(req: Request, res: Response) {
        try {
            const { sessionId } = req.params;

            const result =
                await this._paymentService.verifyCheckoutSession(sessionId);

            res.status(code.OK).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async handleWebhook(req: Request, res: Response) {
        try {
            console.log('it is reaching in handle web hook');
            const sig = req.headers['stripe-signature'] as string;
            const rawBody = req.body;

            await this._paymentService.handleWebhookEvent(rawBody, sig);

            res.status(code.OK).send({ received: true });
        } catch (error: any) {
            res.status(code.BAD_REQUEST).send(
                `Webhook Error: ${error.message}`
            );
            console.error(error);
        }
    }
}
