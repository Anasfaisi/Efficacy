import { IWallet, ITransaction } from '@/models/Wallet.model';
import { ObjectId } from 'mongoose';

export interface IWalletService {
    getWallet(mentorId: string | ObjectId): Promise<IWallet>;
    addEarnings(
        mentorId: string | ObjectId,
        amount: number,
        mentorshipId: string
    ): Promise<IWallet>;
    requestWithdrawal(
        mentorId: string | ObjectId,
        amount: number
    ): Promise<IWallet>;
    updateBankDetails(
        mentorId: string | ObjectId,
        details: {
            accountNumber: string;
            bankName: string;
            ifscCode: string;
            accountHolderName: string;
        }
    ): Promise<IWallet>;
    getTransactions(mentorId: string | ObjectId): Promise<ITransaction[]>;
}
