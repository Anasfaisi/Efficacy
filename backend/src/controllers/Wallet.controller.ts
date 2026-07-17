import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IWalletService } from '@/services/Interfaces/IWallet.service';
import code from '@/types/http-status.enum';
import { SuccessMessages } from '@/types/response-messages.types';

@injectable()
export class WalletController {
    constructor(
        @inject(TYPES.WalletService)
        private _walletService: IWalletService
    ) {}

    async getWallet(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const role = req.currentUser!.role;

        const wallet = await this._walletService.getWallet(userId, role);
        res.status(code.OK).json(wallet);
    }

    async requestWithdrawal(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const { amount } = req.body;

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            res.status(code.BAD_REQUEST).json({
                message: 'Please enter a valid withdrawal amount.',
            });
            return;
        }

        const amtNum = Number(amount);
        if (amtNum < 100) {
            res.status(code.BAD_REQUEST).json({
                message: 'Minimum withdrawal amount is ₹100.',
            });
            return;
        }

        const wallet = await this._walletService.requestWithdrawal(
            userId,
            amtNum
        );
        res.status(code.OK).json({
            message: SuccessMessages.WithdrawalRequested,
            wallet,
        });
    }

    async getTransactions(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const role = req.currentUser!.role;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await this._walletService.getPaginatedTransactions(
            userId,
            role,
            page,
            limit
        );

        res.status(code.OK).json({
            transactions: result.transactions,
            totalCount: result.total,
            totalPages: Math.ceil(result.total / limit),
            currentPage: page,
        });
    }

    async createStripeConnect(req: Request, res: Response): Promise<void> {
        const email = req.currentUser?.email;
        const mentorId = req.currentUser?.id;
        if (!email || !mentorId) {
            res.status(code.NOT_FOUND);
            return;
        }
        const result = await this._walletService.createStripeConnect({
            email,
            mentorId,
        });
        res.status(code.OK).json(result);
    }

    async verifyStripeStatus(req: Request, res: Response): Promise<void> {
        const mentorId = req.currentUser?.id;
        if (!mentorId) {
            res.status(code.NOT_FOUND);
            return;
        }
        const result = await this._walletService.verifyStripeStatus(mentorId);
        res.status(code.OK).json(result);
    }
}
