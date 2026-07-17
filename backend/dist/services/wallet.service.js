"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const wallet_model_1 = require("@/models/wallet.model");
const response_messages_types_1 = require("@/types/response-messages.types");
const stripe_1 = __importDefault(require("stripe"));
const role_types_1 = require("@/types/role.types");
const notification_enum_1 = require("@/types/notification.enum");
let WalletService = class WalletService {
    _walletRepository;
    _notificationService;
    _stripe;
    constructor(_walletRepository, _notificationService) {
        this._walletRepository = _walletRepository;
        this._notificationService = _notificationService;
        this._stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-08-27.basil',
        });
    }
    async getWallet(userId, role) {
        let wallet = await this._walletRepository.findByMentorId(userId);
        if (!wallet) {
            const initialData = {
                balance: 0,
                pendingBalance: 0,
                pendingWithdrawal: 0,
                totalWithdrawn: 0,
                lifetimeEarnings: 0,
                transactions: [],
            };
            if (role === role_types_1.Role.Mentor) {
                initialData.mentorId = userId;
            }
            else {
                initialData.userId = userId;
            }
            wallet = await this._walletRepository.createWallet(initialData);
        }
        return wallet;
    }
    async addEarnings(mentorId, amount, mentorshipId) {
        const wallet = await this.getWallet(mentorId, role_types_1.Role.Mentor);
        if (!wallet) {
            throw new Error(response_messages_types_1.WalletMessages.WalletNotFound);
        }
        wallet.balance += amount;
        wallet.transactions.push({
            amount,
            type: wallet_model_1.TransactionType.EARNING,
            status: wallet_model_1.TransactionStatus.COMPLETED,
            description: `Earnings from mentorship ${mentorshipId}`,
            date: new Date(),
            referenceId: mentorshipId,
        });
        // Recalculate lifetime earnings
        wallet.lifetimeEarnings =
            wallet.balance +
                (wallet.pendingWithdrawal || 0) +
                (wallet.totalWithdrawn || 0);
        await this._walletRepository.updateWallet(wallet.id, wallet);
        return wallet;
    }
    async requestWithdrawal(mentorId, amount) {
        const wallet = await this.getWallet(mentorId, role_types_1.Role.Mentor);
        if (!wallet)
            throw new Error(response_messages_types_1.WalletMessages.WalletNotFound);
        if (wallet.balance < amount)
            throw new Error(response_messages_types_1.ErrorMessages.InsufficientBalance);
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
            type: wallet_model_1.TransactionType.WITHDRAWAL,
            status: wallet_model_1.TransactionStatus.PENDING,
            description: `Withdrawal request for ₹${amount}`,
            date: new Date(),
        });
        await this._walletRepository.updateWallet(wallet.id, wallet);
        const lastTx = wallet.transactions[wallet.transactions.length - 1];
        const transactionId = lastTx?.id?.toString() || '';
        // Notify Admin of the payout request
        await this._notificationService.notifyAdmin(notification_enum_1.NotificationType.MENTOR_PAYOUT_REQUEST, 'New Payout Request', `A mentor has requested a payout of ₹${amount}.`, {
            walletId: wallet.id,
            transactionId,
            amount: amount.toString(),
            link: `/admin/payouts?transactionId=${transactionId}`,
        });
        return wallet;
    }
    // async updateBankDetails(
    //     userId: string | ObjectId,
    //     role: string,
    //     details: {
    //         accountNumber: string;
    //         bankName: string;
    //         ifscCode: string;
    //         accountHolderName: string;
    //     }
    // ): Promise<IWallet> {
    //     const wallet = await this.getWallet(userId, role);
    //     wallet.bankAccountDetails = details;
    //     await this._walletRepository.update(wallet._id as string, wallet);
    //     return wallet;
    // }
    async getPaginatedTransactions(userId, role, page, limit) {
        const wallet = await this.getWallet(userId, role);
        if (!wallet)
            throw new Error(response_messages_types_1.WalletMessages.WalletNotFound);
        return this._walletRepository.findPaginatedTransactions(wallet.id, page, limit);
    }
    async createStripeConnect(data) {
        const account = await this._stripe.accounts.create({
            type: 'express',
            email: data.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            metadata: { mentorId: data.mentorId },
        });
        await this._walletRepository.updateStripeConnectId(data.mentorId, account.id);
        return await this.configureStripeConnectLink(account.id);
    }
    async configureStripeConnectLink(accountId) {
        console.log('account Id : ', accountId);
        const accountLink = await this._stripe.accountLinks.create({
            account: accountId,
            refresh_url: process.env.FRONTEND_URL + '/mentor/wallet?refresh=true',
            return_url: process.env.FRONTEND_URL + '/mentor/wallet?success=true',
            type: 'account_onboarding',
        });
        console.log(accountLink, 'account link from wallet service0');
        return accountLink.url;
    }
    async verifyStripeStatus(mentorId) {
        const wallet = await this.getWallet(mentorId, role_types_1.Role.Mentor);
        if (!wallet || !wallet.stripeConnectAccountId) {
            return { onboarded: false };
        }
        const account = await this._stripe.accounts.retrieve(wallet.stripeConnectAccountId);
        if (account.details_submitted) {
            wallet.stripeConnectOnboarded = true;
            await this._walletRepository.updateWallet(wallet.id, wallet);
        }
        return {
            onboarded: wallet.stripeConnectOnboarded || false,
            email: account.email,
        };
    }
    async approveWithdrawal(walletId, transactionId) {
        const wallet = await this._walletRepository.findById(walletId);
        if (!wallet)
            throw new Error(response_messages_types_1.WalletMessages.NoWallet);
        const transaction = wallet.transactions.find((t) => t.id && t.id.toString() === transactionId);
        if (!transaction)
            throw new Error(response_messages_types_1.WalletMessages.NoTransactions);
        if (transaction.status !== wallet_model_1.TransactionStatus.PENDING) {
            throw new Error(response_messages_types_1.WalletMessages.TransactionNotPending);
        }
        if (wallet.stripeConnectAccountId && wallet.stripeConnectOnboarded) {
            try {
                await this._stripe.transfers.create({
                    amount: Math.round(transaction.amount * 100),
                    currency: 'hkd',
                    destination: wallet.stripeConnectAccountId,
                });
            }
            catch (err) {
                console.error('Stripe Connect Transfer failed:', err);
                const errorMessage = err instanceof Error ? err.message : String(err);
                throw new Error(`Stripe Connect Transfer failed: ${errorMessage}`);
            }
        }
        else {
            console.log('Mentor has no onboarded Stripe Connect Express account. Payout processed manually.');
        }
        const payoutAmount = transaction.amount;
        wallet.pendingWithdrawal = Math.max(0, (wallet.pendingWithdrawal || 0) - payoutAmount);
        wallet.totalWithdrawn = (wallet.totalWithdrawn || 0) + payoutAmount;
        wallet.lifetimeEarnings =
            wallet.balance +
                (wallet.pendingWithdrawal || 0) +
                (wallet.totalWithdrawn || 0);
        transaction.status = wallet_model_1.TransactionStatus.COMPLETED;
        await this._walletRepository.update(wallet._id, wallet);
        const mentorIdStr = wallet.mentorId ? wallet.mentorId.toString() : '';
        if (mentorIdStr) {
            await this._notificationService.createNotification(mentorIdStr, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTOR_PAYOUT_PROCESSED, 'Payout Approved & Transferred', `Your payout of ₹${payoutAmount} has been approved and transferred successfully.`, { transactionId });
        }
        return wallet;
    }
    async rejectWithdrawal(walletId, transactionId) {
        const wallet = await this._walletRepository.findWalletById(walletId);
        if (!wallet)
            throw new Error(response_messages_types_1.WalletMessages.NoWallet);
        const transaction = wallet?.transactions?.find((t) => t.id && t.id.toString() === transactionId);
        if (!transaction)
            throw new Error(response_messages_types_1.WalletMessages.NoTransactions);
        if (transaction.status !== wallet_model_1.TransactionStatus.PENDING) {
            throw new Error(response_messages_types_1.WalletMessages.TransactionNotPending);
        }
        const payoutAmount = transaction.amount;
        wallet.balance = (wallet.balance ?? 0) + payoutAmount;
        wallet.pendingWithdrawal = Math.max(0, (wallet.pendingWithdrawal || 0) - payoutAmount);
        wallet.lifetimeEarnings =
            wallet.balance +
                (wallet.pendingWithdrawal || 0) +
                (wallet.totalWithdrawn || 0);
        transaction.status = wallet_model_1.TransactionStatus.FAILED;
        // const udpatedWallet = await this._walletRepository.updateWallet(
        //     wallet.id as string,
        //     wallet
        // );
        // Notify Mentor of rejected payout request
        const mentorIdStr = wallet.mentorId ? wallet.mentorId.toString() : '';
        if (mentorIdStr) {
            await this._notificationService.createNotification(mentorIdStr, role_types_1.Role.Mentor, notification_enum_1.NotificationType.MENTOR_PAYOUT_PROCESSED, 'Payout Request Rejected', `Your payout request of ₹${payoutAmount} has been rejected. The funds have been refunded to your wallet.`, { transactionId });
        }
        return wallet;
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.WalletRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationService)),
    __metadata("design:paramtypes", [Object, Object])
], WalletService);
//# sourceMappingURL=wallet.service.js.map