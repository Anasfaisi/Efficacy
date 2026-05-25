import { IWallet, ITransaction } from '@/models/wallet.model';
import { IBaseRepository } from './IBase.repository';
import { ObjectId } from 'mongoose';
import { WalletEntity } from '@/entity/wallet.entity';

export interface IWalletRepository extends IBaseRepository<IWallet> {
    findWalletById(walletId:string):Promise<Partial<WalletEntity> | null>
    findByMentorId(mentorId: string | ObjectId): Promise<IWallet | null>;
    creditPendingBalance(
        mentorId: string | ObjectId,
        amount: number,
        description: string
    ): Promise<void>;
    releasePendingBalance(
        mentorId: string | ObjectId,
        amount: number
    ): Promise<void>;
    debitPendingBalance(
        mentorId: string | ObjectId,
        amount: number
    ): Promise<void>;
    findByUserId(userId: string | ObjectId): Promise<IWallet | null>;
    creditBalance(
        userId: string | ObjectId,
        amount: number,
        description: string
    ): Promise<void>;
    findAllWallets(): Promise<IWallet[]>;
    getGlobalTransactions(
        page: number,
        limit: number,
        filter: 'all' | 'mentor' | 'user'
    ): Promise<{ transactions: ITransaction[]; total: number }>;
    findPaginatedTransactions(
        walletId: string | ObjectId,
        page: number,
        limit: number
    ): Promise<{ transactions: ITransaction[]; total: number }>;

    updateStripeConnectId(mentorId: string, accountId: string): Promise<void>;
}
