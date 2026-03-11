import api from './axiosConfig';
import { WalletRoutes } from './constant.routes';

export const walletApi = {
    getWallet: async () => {
        const response = await api.get(WalletRoutes.BASE);
        return response.data;
    },

    requestWithdrawal: async (amount: number) => {
        const response = await api.post(WalletRoutes.CREATE_WITHDRAWAL, {
            amount,
        });
        return response.data;
    },

    updateBankDetails: async (details: string) => {
        const response = await api.patch(
           WalletRoutes.UPDATE_BANK_DETAILS,
            details
        );
        return response.data;
    },

    getTransactions: async (page: number = 1, limit: number = 6) => {
        const response = await api.get(WalletRoutes.GET_TRANSACTIONS,{
            params:{
                page,
                limit
            }
        });
        return response.data;
    },
};
