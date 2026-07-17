"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMapper = void 0;
const mongoose_1 = require("mongoose");
class WalletMapper {
    static ToEntity(wallet) {
        if (!wallet)
            return null;
        return {
            id: wallet.id,
            mentorId: wallet.mentorId?.toString(),
            userId: wallet.userId?.toString(),
            balance: wallet.balance ?? 0,
            pendingBalance: wallet.pendingBalance ?? 0,
            pendingWithdrawal: wallet.pendingWithdrawal ?? 0,
            totalWithdrawn: wallet.totalWithdrawn ?? 0,
            lifetimeEarnings: wallet.lifetimeEarnings ?? 0,
            transactions: wallet.transactions.map((t) => ({
                id: t.id ?? t.id?.toString() ?? '',
                amount: t.amount,
                type: t.type,
                status: t.status,
                description: t.description,
                date: t.date,
                referenceId: t.referenceId,
            })),
            bankAccountDetails: wallet.bankAccountDetails,
            stripeConnectAccountId: wallet.stripeConnectAccountId,
            stripeConnectOnboarded: wallet.stripeConnectOnboarded,
        };
    }
    static ToPersistence(entity) {
        return {
            mentorId: entity.mentorId
                ? new mongoose_1.Types.ObjectId(entity.mentorId)
                : undefined,
            userId: entity.userId
                ? new mongoose_1.Types.ObjectId(entity.userId)
                : undefined,
            balance: entity.balance,
            pendingBalance: entity.pendingBalance,
            pendingWithdrawal: entity.pendingWithdrawal,
            totalWithdrawn: entity.totalWithdrawn,
            lifetimeEarnings: entity.lifetimeEarnings,
            transactions: entity.transactions,
            bankAccountDetails: entity.bankAccountDetails,
            stripeConnectAccountId: entity.stripeConnectAccountId,
            stripeConnectOnboarded: entity.stripeConnectOnboarded,
        };
    }
}
exports.WalletMapper = WalletMapper;
//# sourceMappingURL=wallet.mapper.js.map