import { Schema, model, Document, Types } from 'mongoose';

export enum TransactionType {
    EARNING = 'earning',
    WITHDRAWAL = 'withdrawal',
    REFUND = 'refund',
}

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

interface ITransaction {
    id?: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    date: Date;
    referenceId?: string;
}

interface IWallet extends Document {
    id?: string;
    mentorId?: Types.ObjectId;
    userId?: Types.ObjectId;
    balance: number;
    pendingBalance: number;
    pendingWithdrawal?: number;
    totalWithdrawn?: number;
    lifetimeEarnings?: number;
    transactions: ITransaction[];
    bankAccountDetails?: {
        accountNumber: string;
        bankName: string;
        ifscCode: string;
        accountHolderName: string;
    };
    stripeConnectAccountId?: string;
    stripeConnectOnboarded?: boolean;
}

const transactionSchema = new Schema<ITransaction>({
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
    },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    referenceId: { type: String },
});

const walletSchema = new Schema<IWallet>(
    {
        mentorId: {
            type: Schema.Types.ObjectId,
            ref: 'Mentors',
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
        balance: { type: Number, default: 0 },
        pendingBalance: { type: Number, default: 0 },
        pendingWithdrawal: { type: Number, default: 0 },
        totalWithdrawn: { type: Number, default: 0 },
        lifetimeEarnings: { type: Number, default: 0 },
        transactions: [transactionSchema],
        bankAccountDetails: {
            accountNumber: { type: String },
            bankName: { type: String },
            ifscCode: { type: String },
            accountHolderName: { type: String },
        },
        stripeConnectAccountId: { type: String },
        stripeConnectOnboarded: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export { IWallet, ITransaction };
export default model<IWallet>('Wallets', walletSchema);
