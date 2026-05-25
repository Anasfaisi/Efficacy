
import { createStripeConnectReqDto } from '@/dto/wallet-request.dto'
import { WalletEntity } from '@/entity/wallet.entity';
import { ITransaction, IWallet } from '@/models/wallet.model';
import { ObjectId } from 'mongoose';



export interface IWalletService {
    getWallet(userId: string | ObjectId, role: string): Promise<IWallet>;
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
        userId: string | ObjectId,
        role: string,
        details: {
            accountNumber: string;
            bankName: string;
            ifscCode: string;
            accountHolderName: string;
        }
    ): Promise<IWallet>;
    getPaginatedTransactions(
        userId: string | ObjectId,
        role: string,
        page: number,
        limit: number
    ): Promise<{ transactions: ITransaction[]; total: number }>;
    createStripeConnect(data: createStripeConnectReqDto): Promise<string>;
    verifyStripeStatus(
        mentorId: string
    ): Promise<{ onboarded: boolean; email?: string | null }>;
    approveWithdrawal(
        walletId: string,
        transactionId: string
    ): Promise<IWallet>;
    rejectWithdrawal(walletId: string, transactionId: string): Promise<WalletEntity>;
}
