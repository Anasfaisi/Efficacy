import { IWallet, ITransaction } from '@/models/Wallet.model';
import { IBaseRepository } from './IBase.repository';
import { ObjectId } from 'mongoose';

export interface IWalletRepository extends IBaseRepository<IWallet> {
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
}
