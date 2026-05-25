import { TransactionStatus, TransactionType } from '@/models/Wallet.model';

export interface TransactionEntity {
    id:string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    date: Date;
    referenceId?: string;
}
