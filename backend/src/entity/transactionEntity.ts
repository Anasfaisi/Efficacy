import { TransactionStatus, TransactionType } from '@/models/Wallet.model';

export interface TransactionEntity {
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    date: Date;
    referenceId?: string;
}
