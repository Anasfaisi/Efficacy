import { ObjectId } from 'mongoose';
import { MentorEntity } from './mentor.entity';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from './user.entity';

export interface WalletEntity {
    id: string;
    mentorId?: string | MentorEntity|ObjectId;
    userId?: string | UserEntity|ObjectId;
    balance: number;
    pendingBalance: number;
    pendingWithdrawal?: number;
    totalWithdrawn?: number;
    lifetimeEarnings?: number;
    transactions: TransactionEntity[];
    bankAccountDetails?: {
        accountNumber: string;
        bankName: string;
        ifscCode: string;
        accountHolderName: string;
    };
    stripeConnectAccountId?: string;
    stripeConnectOnboarded?: boolean;
}
