export interface BankAccountDetails {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
}

export interface Transaction {
    _id: string;
    description: string;
    amount: number;
    type: 'earning' | 'withdrawal' | 'refund' | 'payment';
    status: 'pending' | 'completed' | 'failed';
    date: string;
}

export interface WalletData {
    balance: number;
    lifeTimeEarning: number;
    mentorId: string;
    pendingBalance: number;
    pendingWithdrawal: number;
    stripeConnectAccountId: string;
    stripeConnectOnboarded: boolean;
    totalWithdrawn: number;
    transactions: Transaction[];
}

export interface TransactionResponse {
    transactions: Transaction[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
