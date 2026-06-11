import { injectable, inject } from 'inversify';
import { IWalletService } from './Interfaces/IWallet.service';
import { TYPES } from '@/config/inversify-key.types';
import { IWalletRepository } from '@/repositories/interfaces/IWallet.repository';
import {
    IWallet,
    ITransaction,
    TransactionType,
    TransactionStatus,
} from '@/models/wallet.model';
import { ObjectId, Types } from 'mongoose';
import { ErrorMessages, WalletMessages } from '@/types/response-messages.types';
import { createStripeConnectReqDto } from '@/dto/wallet-request.dto';
import Stripe from 'stripe';
import { INotificationService } from './Interfaces/INotification.service';
import { Role } from '@/types/role.types';
import { NotificationType } from '@/types/notification.enum';
import { WalletEntity } from '@/entity/wallet.entity';
import { TransactionEntity } from '@/entity/transaction.entity';
import { WalletMapper } from '@/Mapper/wallet.mapper';

@injectable()
export class WalletService implements IWalletService {
    private _stripe: Stripe;
    constructor(
        @inject(TYPES.WalletRepository)
        private _walletRepository: IWalletRepository,
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService
    ) {
        this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-08-27.basil',
        });
    }

    async getWallet(userId: string | ObjectId, role: string): Promise<IWallet> {
        let wallet =
            role === Role.Mentor
                ? await this._walletRepository.findByMentorId(userId)
                : await this._walletRepository.findByUserId(userId);

        if (!wallet) {
            const initialData: any = {
                balance: 0,
                pendingBalance: 0,
                pendingWithdrawal: 0,
                totalWithdrawn: 0,
                lifetimeEarnings: 0,
                transactions: [],
            };
            if (role === Role.Mentor) {
                initialData.mentorId = userId as any;
            } else {
                initialData.userId = userId as any;
            }
            wallet = await this._walletRepository.create(initialData);
        }
        return wallet;
    }

    async addEarnings(
        mentorId: string | ObjectId,
        amount: number,
        mentorshipId: string
    ): Promise<IWallet> {
        const wallet = await this.getWallet(mentorId, Role.Mentor);

        wallet.balance += amount;
        wallet.transactions.push({
            amount,
            type: TransactionType.EARNING,
            status: TransactionStatus.COMPLETED,
            description: `Earnings from mentorship ${mentorshipId}`,
            date: new Date(),
            referenceId: mentorshipId,
        });

        // Recalculate lifetime earnings
        wallet.lifetimeEarnings =
            wallet.balance +
            (wallet.pendingWithdrawal || 0) +
            (wallet.totalWithdrawn || 0);

        await this._walletRepository.update(wallet._id as string, wallet);
        return wallet;
    }

    async requestWithdrawal(
        mentorId: string | ObjectId,
        amount: number
    ): Promise<IWallet> {
        const wallet = await this.getWallet(mentorId, Role.Mentor);
        if (wallet.balance < amount)
            throw new Error(ErrorMessages.InsufficientBalance);

        // Deduct from balance, add to pendingWithdrawal
        wallet.balance -= amount;
        wallet.pendingWithdrawal = (wallet.pendingWithdrawal || 0) + amount;

        // Recalculate lifetime earnings
        wallet.lifetimeEarnings =
            wallet.balance +
            (wallet.pendingWithdrawal || 0) +
            (wallet.totalWithdrawn || 0);

        wallet.transactions.push({
            amount,
            type: TransactionType.WITHDRAWAL,
            status: TransactionStatus.PENDING,
            description: `Withdrawal request for ₹${amount}`,
            date: new Date(),
        });

        await this._walletRepository.update(wallet._id as string, wallet);

        const lastTx = wallet.transactions[wallet.transactions.length - 1];
        const transactionId =
            lastTx && (lastTx as any)._id ? (lastTx as any)._id.toString() : '';

        // Notify Admin of the payout request
        await this._notificationService.notifyAdmin(
            NotificationType.MENTOR_PAYOUT_REQUEST,
            'New Payout Request',
            `A mentor has requested a payout of ₹${amount}.`,
            {
                walletId: wallet._id as string,
                transactionId,
                amount: amount.toString(),
                link: `/admin/payouts?transactionId=${transactionId}`,
            }
        );

        return wallet;
    }

    async updateBankDetails(
        userId: string | ObjectId,
        role: string,
        details: {
            accountNumber: string;
            bankName: string;
            ifscCode: string;
            accountHolderName: string;
        }
    ): Promise<IWallet> {
        const wallet = await this.getWallet(userId, role);
        wallet.bankAccountDetails = details;
        await this._walletRepository.update(wallet._id as string, wallet);
        return wallet;
    }

    async getPaginatedTransactions(
        userId: string | ObjectId,
        role: string,
        page: number,
        limit: number
    ): Promise<{ transactions: ITransaction[]; total: number }> {
        const wallet = await this.getWallet(userId, role);
        return this._walletRepository.findPaginatedTransactions(
            wallet._id as string,
            page,
            limit
        );
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
        await this._walletRepository.updateStripeConnectId(
            data.mentorId,
            account.id
        );

        return await this.configureStripeConnectLink(account.id);
    }

    private async configureStripeConnectLink(
        accountId: string
    ): Promise<string> {
        console.log('account Id : ', accountId);
        const accountLink = await this._stripe.accountLinks.create({
            account: accountId,
            refresh_url:
                process.env.FRONTEND_URL + '/mentor/wallet?refresh=true',
            return_url:
                process.env.FRONTEND_URL + '/mentor/wallet?success=true',
            type: 'account_onboarding',
        });
        console.log(accountLink, 'account link from wallet service0');
        return accountLink.url;
    }

    async verifyStripeStatus(
        mentorId: string
    ): Promise<{ onboarded: boolean; email?: string | null }> {
        const wallet = await this.getWallet(mentorId, Role.Mentor);
        if (!wallet || !wallet.stripeConnectAccountId) {
            return { onboarded: false };
        }

        const account = await this._stripe.accounts.retrieve(
            wallet.stripeConnectAccountId
        );

        if (account.details_submitted) {
            wallet.stripeConnectOnboarded = true;
            await this._walletRepository.update(wallet._id as string, wallet);
        }

        return {
            onboarded: wallet.stripeConnectOnboarded || false,
            email: account.email,
        };
    }

    async approveWithdrawal(
        walletId: string,
        transactionId: string
    ): Promise<IWallet> {
        const wallet = await this._walletRepository.findById(walletId);
        if (!wallet) throw new Error(WalletMessages.NoWallet);

        const transaction = wallet.transactions.find(
            (t: any) => t._id && t._id.toString() === transactionId
        );
        if (!transaction) throw new Error(WalletMessages.NoTransactions);
        if (transaction.status !== TransactionStatus.PENDING) {
            throw new Error(WalletMessages.TransactionNotPending);
        }

        if (wallet.stripeConnectAccountId && wallet.stripeConnectOnboarded) {
            try {
                await this._stripe.transfers.create({
                    amount: Math.round(transaction.amount * 100),
                    currency: 'hkd',
                    destination: wallet.stripeConnectAccountId,
                });
            } catch (err: any) {
                console.error('Stripe Connect Transfer failed:', err);
                throw new Error(
                    `Stripe Connect Transfer failed: ${err.message}`
                );
            }
        } else {
            console.log(
                'Mentor has no onboarded Stripe Connect Express account. Payout processed manually.'
            );
        }

        const payoutAmount = transaction.amount;
        wallet.pendingWithdrawal = Math.max(
            0,
            (wallet.pendingWithdrawal || 0) - payoutAmount
        );
        wallet.totalWithdrawn = (wallet.totalWithdrawn || 0) + payoutAmount;

        wallet.lifetimeEarnings =
            wallet.balance +
            (wallet.pendingWithdrawal || 0) +
            (wallet.totalWithdrawn || 0);

        transaction.status = TransactionStatus.COMPLETED;

        await this._walletRepository.update(wallet._id as string, wallet);

        const mentorIdStr = wallet.mentorId ? wallet.mentorId.toString() : '';
        if (mentorIdStr) {
            await this._notificationService.createNotification(
                mentorIdStr,
                Role.Mentor,
                NotificationType.MENTOR_PAYOUT_PROCESSED,
                'Payout Approved & Transferred',
                `Your payout of ₹${payoutAmount} has been approved and transferred successfully.`,
                { transactionId }
            );
        }

        return wallet;
    }

    async rejectWithdrawal(
        walletId: string,
        transactionId: string
    ): Promise<WalletEntity> {
        const wallet = await this._walletRepository.findWalletById(walletId);
        if (!wallet ) throw new Error(WalletMessages.NoWallet);

        const transaction = wallet?.transactions?.find(
            (t: TransactionEntity) => t.id && t.id.toString() === transactionId
        );
        if (!transaction) throw new Error(WalletMessages.NoTransactions);
        if (transaction.status !== TransactionStatus.PENDING) {
            throw new Error(WalletMessages.TransactionNotPending);
        }

        const payoutAmount = transaction.amount;

        wallet.balance = (wallet.balance?? 0) + payoutAmount;
        wallet.pendingWithdrawal = Math.max(
            0,
            (wallet.pendingWithdrawal || 0) - payoutAmount
        );

        wallet.lifetimeEarnings =
            wallet.balance +
            (wallet.pendingWithdrawal || 0) +
            (wallet.totalWithdrawn || 0);

        transaction.status = TransactionStatus.FAILED;

       const udpatedWallet= await this._walletRepository.update(wallet.id as string, wallet);

        // Notify Mentor of rejected payout request
        const mentorIdStr = wallet.mentorId ? wallet.mentorId.toString() : '';
        if (mentorIdStr) {
            await this._notificationService.createNotification(
                mentorIdStr,
                Role.Mentor,
                NotificationType.MENTOR_PAYOUT_PROCESSED,
                'Payout Request Rejected',
                `Your payout request of ₹${payoutAmount} has been rejected. The funds have been refunded to your wallet.`,
                { transactionId }
            );
        }

        return WalletMapper.ToEntity(udpatedWallet) as WalletEntity;
    }
}
