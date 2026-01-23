import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IWalletRepository } from '@/repositories/interfaces/IWallet.repository';
import code from '@/types/http-status.enum';
import { Role } from '@/types/role.types';

@injectable()
export class WalletController {
    constructor(
        @inject(TYPES.WalletRepository)
        private _walletRepository: IWalletRepository
    ) {}

    async getWallet(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const role = req.currentUser!.role;

        let wallet;
        if (role === Role.Mentor) {
            wallet = await this._walletRepository.findByMentorId(userId);
        } else {
            wallet = await this._walletRepository.findByUserId(userId);
        }

        if (!wallet) {
            res.status(code.OK).json({
                balance: 0,
                pendingBalance: 0,
                transactions: [],
            });
            return;
        }

        res.status(code.OK).json(wallet);
    }

    async updateBankDetails(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const role = req.currentUser!.role;
        const details = req.body;

        let wallet =
            role === Role.Mentor
                ? await this._walletRepository.findByMentorId(userId)
                : await this._walletRepository.findByUserId(userId);

        if (!wallet) {
            const initialData: any = {
                balance: 0,
                pendingBalance: 0,
                transactions: [],
                bankAccountDetails: details,
            };
            if (role === Role.Mentor) initialData.mentorId = userId;
            else initialData.userId = userId;

            wallet = await this._walletRepository.create(initialData);
        } else {
            wallet.bankAccountDetails = details;
            await wallet.save();
        }

        res.status(code.OK).json(wallet);
    }

    async requestWithdrawal(req: Request, res: Response): Promise<void> {
        // Placeholder for withdrawal logic
        res.status(code.OK).json({ message: 'Withdrawal requested' });
    }

    async getTransactions(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const role = req.currentUser!.role;

        const wallet =
            role === Role.Mentor
                ? await this._walletRepository.findByMentorId(userId)
                : await this._walletRepository.findByUserId(userId);

        res.status(code.OK).json(wallet?.transactions || []);
    }
}
