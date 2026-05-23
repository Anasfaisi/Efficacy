import { WalletEntity } from '@/entity/wallet.entity';
import { IWallet } from '@/models/wallet.model';

export class WalletMapper {
    static ToEntity(wallet: IWallet): WalletEntity {
        return {
            id: wallet.id,
            mentorId: wallet.mentorId?.toString(),
            userId: wallet.userId?.toString(),
            balance: wallet.balance,
            pendingBalance: wallet.pendingBalance,
            transactions: wallet.transactions,
            bankAccountDetails: wallet.bankAccountDetails,
            stripeConnectAccountId: wallet.stripeConnectAccountId,
            stripeConnectOnboarded: wallet.stripeConnectOnboarded,
        };
    }
}
