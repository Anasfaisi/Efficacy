import { WalletEntity } from '@/entity/wallet.entity';
import { IWallet } from '@/models/wallet.model';
import { TransactionEntity } from '@/entity/transaction.entity';

export class WalletMapper {
    static ToEntity(wallet: Partial<IWallet> | null): Partial <WalletEntity> | null {
        if (!wallet) return null;
        return {
            id: wallet.id,
            mentorId: wallet.mentorId?.toString(),
            userId: wallet.userId?.toString(),
            balance: wallet.balance,
            pendingBalance: wallet.pendingBalance,
            pendingWithdrawal: wallet.pendingWithdrawal,
            totalWithdrawn: wallet.totalWithdrawn,
            lifetimeEarnings: wallet.lifetimeEarnings,
            transactions: wallet.transactions?.map(t => ({
                id: t.id ?? (t as TransactionEntity).id?.toString() ?? '',
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
}
