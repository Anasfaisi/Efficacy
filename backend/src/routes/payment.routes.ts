import { Router } from 'express';
import { PaymentController } from '@/controllers/payment.controller';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function paymentRoutes(paymentController: PaymentController) {
    const router = Router();

    router.post(
        '/checkout-mentorship',
        asyncWrapper(
            paymentController.createMentorshipSession.bind(paymentController)
        )
    );
    router.get(
        '/verify/:sessionId',
        asyncWrapper(
            paymentController.verifyCheckoutSession.bind(paymentController)
        )
    );

    return router;
}
