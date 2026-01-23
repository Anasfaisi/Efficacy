import { Router } from 'express';
import { MentorshipController } from '@/controllers/mentorship.controller';
import { WalletController } from '@/controllers/Wallet.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';
import { TokenService } from '@/serivces/token.service';
import { Role } from '@/types/role.types';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function mentorshipRoutes(
    mentorshipController: MentorshipController
) {
    const router = Router();
    const tokenService = container.get<TokenService>(TYPES.TokenService);

    router.post(
        '/request',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(
            mentorshipController.createRequest.bind(mentorshipController)
        )
    );

    router.get(
        '/requests/mentor',
        authenticateAndAuthorize(tokenService, Role.Mentor),
        asyncWrapper(
            mentorshipController.getMentorRequests.bind(mentorshipController)
        )
    );

    router.get(
        '/requests/user',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(
            mentorshipController.getUserRequests.bind(mentorshipController)
        )
    );

    router.patch(
        '/request/:id/respond',
        authenticateAndAuthorize(tokenService, Role.Mentor),
        asyncWrapper(
            mentorshipController.respondToRequest.bind(mentorshipController)
        )
    );

    router.patch(
        '/request/:id/confirm',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(
            mentorshipController.confirmSuggestion.bind(mentorshipController)
        )
    );

    router.post(
        '/request/:id/verify-payment',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(
            mentorshipController.verifyPayment.bind(mentorshipController)
        )
    );

    // Wallet Routes
    const walletController = container.get<WalletController>(
        TYPES.WalletController
    );

    router.get(
        '/wallet',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(walletController.getWallet.bind(walletController))
    );

    router.post(
        '/wallet/withdraw',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(walletController.requestWithdrawal.bind(walletController))
    );

    router.patch(
        '/wallet/bank-details',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(walletController.updateBankDetails.bind(walletController))
    );

    router.get(
        '/wallet/transactions',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(walletController.getTransactions.bind(walletController))
    );

    router.get(
        '/active',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(
            mentorshipController.getActiveMentorship.bind(mentorshipController)
        )
    );

    router.get(
        '/:id',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(
            mentorshipController.getMentorshipById.bind(mentorshipController)
        )
    );

    router.post(
        '/:id/book-session',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(
            mentorshipController.bookSession.bind(mentorshipController)
        )
    );

    router.post(
        '/:id/reschedule-session',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(
            mentorshipController.rescheduleSession.bind(mentorshipController)
        )
    );

    router.post(
        '/:id/complete',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(
            mentorshipController.completeMentorship.bind(mentorshipController)
        )
    );

    router.post(
        '/:id/feedback',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(
            mentorshipController.submitFeedback.bind(mentorshipController)
        )
    );

    router.post(
        '/:id/cancel',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(
            mentorshipController.cancelMentorship.bind(mentorshipController)
        )
    );

    return router;
}
