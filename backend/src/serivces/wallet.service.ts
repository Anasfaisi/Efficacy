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
import { ErrorMessages } from '@/types/response-messages.types';
import { createStripeConnectReqDto } from '@/dto/wallet-request.dto';
import Stripe from 'stripe';
import { email } from 'zod';

@injectable()
export class WalletService implements IWalletService {
    private _stripe: Stripe;
    constructor(
        @inject(TYPES.WalletRepository)
        private _walletRepository: IWalletRepository
    ) {
        this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-08-27.basil',
        });
    }

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
        if (wallet.balance < amount)
            throw new Error(ErrorMessages.InsufficientBalance);

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

    async createStripeConnect(
        data: createStripeConnectReqDto
    ): Promise<string> {
 
        const account = await this._stripe.accounts.create({
            type: 'express',
            email: data.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            metadata: { mentorId: data.mentorId },
        });
console.log("account , ",account)
      await  this._walletRepository.updateStripeConnectId(data.mentorId, account.id);

      return await   this.configureStripeConnectLink(account.id)
    }

    private async configureStripeConnectLink(
        accountId: string
    ): Promise<string> {
        console.log("account Id : ",accountId)
        const accountLink = await this._stripe.accountLinks.create({
            account: accountId,
            refresh_url: process.env.FRONTEND_URL+'/mentor/wallet?refresh=true',
            return_url: process.env.FRONTEND_URL+'/mentor/wallet?success=true',
            type: 'account_onboarding',
        });
        console.log(accountLink,"account link from wallet service0")
        return accountLink.url;
    }
}
