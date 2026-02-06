import { Schema, model, Document, ObjectId } from 'mongoose';

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
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    date: Date;
    referenceId?: string; // e.g., Mentorship ID or Withdrawal Request ID
}

interface IWallet extends Document {
    mentorId?: ObjectId;
    userId?: ObjectId;
    balance: number;
    pendingBalance: number;
    transactions: ITransaction[];
    bankAccountDetails?: {
        accountNumber: string;
        bankName: string;
        ifscCode: string;
        accountHolderName: string;
    };
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
        transactions: [transactionSchema],
        bankAccountDetails: {
            accountNumber: { type: String },
            bankName: { type: String },
            ifscCode: { type: String },
            accountHolderName: { type: String },
        },
    },
    { timestamps: true }
);

walletSchema.index({ mentorId: 1 }, { unique: true, sparse: true });
walletSchema.index({ userId: 1 }, { unique: true, sparse: true });

export { IWallet, ITransaction };
export default model<IWallet>('Wallets', walletSchema);
