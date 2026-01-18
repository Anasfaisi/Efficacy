import axiosInstance from './axiosConfig';

export const walletApi = {
    getWallet: async () => {
        const response = await axiosInstance.get('/mentorship/wallet');
        return response.data;
    },

    requestWithdrawal: async (amount: number) => {
        const response = await axiosInstance.post(
            '/mentorship/wallet/withdraw',
            { amount },
        );
        return response.data;
    },

    updateBankDetails: async (details: any) => {
        const response = await axiosInstance.patch(
            '/mentorship/wallet/bank-details',
            details,
        );
        return response.data;
    },

    getTransactions: async () => {
        const response = await axiosInstance.get(
            '/mentorship/wallet/transactions',
        );
        return response.data;
    },
};
