import { WalletController } from '@/controllers/Wallet.controller';
import authenticateAndAuthorize from '@/middleware/authenticate-and-authorize';
import { ITokenService } from '@/services/Interfaces/IToken.service';
import { Role } from '@/types/role.types';
import { asyncWrapper } from '@/utils/asyncWrapper';
import { Router } from 'express';

export default function WalletRoutes(
    walletController: WalletController,
    tokenService: ITokenService
) {
    const router = Router();
    router.get(
        '/',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(walletController.getWallet.bind(walletController))
    );

    router.post(
        '/withdraw',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(walletController.requestWithdrawal.bind(walletController))
    );

    router.patch(
        '/bank-details',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(walletController.updateBankDetails.bind(walletController))
    );

    router.get(
        '/transactions',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(walletController.getTransactions.bind(walletController))
    );

    router.post(
        '/stripe-connect',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        asyncWrapper(
            walletController.createStripeConnect.bind(walletController)
        )
    );

    router.get(
        '/stripe-status',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        asyncWrapper(walletController.verifyStripeStatus.bind(walletController))
    );

    return router;
}
