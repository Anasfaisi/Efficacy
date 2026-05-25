import { WalletEntity } from '@/entity/wallet.entity';
import { IWallet } from '@/models/Wallet.model';

export class WalletMapper {
    static ToEntity(wallet: IWallet | null): WalletEntity | null {
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
            transactions: wallet.transactions,
            bankAccountDetails: wallet.bankAccountDetails,
            stripeConnectAccountId: wallet.stripeConnectAccountId,
            stripeConnectOnboarded: wallet.stripeConnectOnboarded,
        };
    }
}
