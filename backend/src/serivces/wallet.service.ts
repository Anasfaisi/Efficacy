import { injectable, inject } from 'inversify';
import { IWalletService } from './Interfaces/IWallet.service';
import { TYPES } from '@/config/inversify-key.types';
import { IWalletRepository } from '@/repositories/interfaces/IWallet.repository';
import {
    IWallet,
    ITransaction,
    TransactionType,
    TransactionStatus,
} from '@/models/Wallet.model';
import { ObjectId } from 'mongoose';

@injectable()
export class WalletService implements IWalletService {
    constructor(
        @inject(TYPES.WalletRepository)
        private _walletRepository: IWalletRepository
    ) {}

    async getWallet(mentorId: string | ObjectId): Promise<IWallet> {
        let wallet = await this._walletRepository.findByMentorId(mentorId);
        if (!wallet) {
            wallet = await this._walletRepository.create({
                mentorId,
                balance: 0,
                pendingBalance: 0,
                transactions: [],
            } as any);
        }
        return wallet;
    }

    async addEarnings(
        mentorId: string | ObjectId,
        amount: number,
        mentorshipId: string
    ): Promise<IWallet> {
        const wallet = await this.getWallet(mentorId);

        wallet.balance += amount;
        wallet.transactions.push({
            amount,
            type: TransactionType.EARNING,
            status: TransactionStatus.COMPLETED,
            description: `Earnings from mentorship ${mentorshipId}`,
            date: new Date(),
            referenceId: mentorshipId,
        });

        await this._walletRepository.update(wallet._id as string, wallet);
        return wallet;
    }

    async requestWithdrawal(
        mentorId: string | ObjectId,
        amount: number
    ): Promise<IWallet> {
        const wallet = await this.getWallet(mentorId);
        if (wallet.balance < amount) throw new Error('Insufficient balance');

        wallet.balance -= amount;
        wallet.transactions.push({
            amount,
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.PENDING,
            description: `Withdrawal request`,
            date: new Date(),
        });

        await this._walletRepository.update(wallet._id as string, wallet);
        return wallet;
    }

    async updateBankDetails(
        mentorId: string | ObjectId,
        details: {
            accountNumber: string;
            bankName: string;
            ifscCode: string;
            accountHolderName: string;
        }
        
    ): Promise<IWallet> {
        const wallet = await this.getWallet(mentorId);
        wallet.bankAccountDetails = details;
        await this._walletRepository.update(wallet._id as string, wallet);
        return wallet;
    }

    async getTransactions(
        mentorId: string | ObjectId
    ): Promise<ITransaction[]> {
        const wallet = await this.getWallet(mentorId);
        return wallet.transactions;
    }
}
