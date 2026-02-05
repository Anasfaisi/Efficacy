import api from './axiosConfig';

export const walletApi = {
    getWallet: async () => {
        const response = await api.get('/mentorship/wallet');
        return response.data;
    },

    requestWithdrawal: async (amount: number) => {
        const response = await api.post(
            '/mentorship/wallet/withdraw',
            { amount }
        );
        return response.data;
    },

    updateBankDetails: async (details: any) => {
        const response = await api.patch(
            '/mentorship/wallet/bank-details',
            details
        );
        return response.data;
    },

    getTransactions: async (page: number = 1, limit: number = 6) => {
        const response = await api.get(
            `/mentorship/wallet/transactions?page=${page}&limit=${limit}`
        );
        return response.data;
    },
};
