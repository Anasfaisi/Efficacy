import { MentorEntity } from './mentor.entity';
import { TransactionEntity } from './transactionEntity';
import { UserEntity } from './user.entity';

export interface WalletEntity {
    id: string;
    mentorId?: string | MentorEntity;
    userId?: string | UserEntity;
    balance: number;
    pendingBalance: number;
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
