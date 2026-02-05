import React, { useEffect, useState } from 'react';
import { walletApi } from '@/Services/wallet.api';
import {
    Wallet,
    IndianRupee,
    Clock,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    ArrowUpCircle,
    ArrowDownCircle,
    Plus,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '../../home/layouts/Sidebar';
import { motion } from 'framer-motion';
import type { WalletData, Transaction, TransactionResponse, BankAccountDetails } from '@/types/wallet';
import { bankDetailsSchema } from '@/types/zodSchemas';
import { ZodError } from 'zod';

const UserWalletPage: React.FC = () => {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(2);
    const [isUpdatingBank, setIsUpdatingBank] = useState(false);
    const [showBankForm, setShowBankForm] = useState(false);
    const [bankDetails, setBankDetails] = useState<BankAccountDetails>({
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        accountHolderName: '',
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [walletData, txData]: [WalletData, TransactionResponse] = await Promise.all([
                walletApi.getWallet(),
                walletApi.getTransactions(page, limit)
            ]);
            setWallet(walletData);
            setTransactions(txData.transactions);
            setTotalPages(txData.totalPages);

            if (walletData?.bankAccountDetails) {
                setBankDetails(walletData.bankAccountDetails);
            }
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
            toast.error('Failed to load wallet data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleUpdateBankDetails = async () => {
        setIsUpdatingBank(true);
        try {
            bankDetailsSchema.parse(bankDetails);
            await walletApi.updateBankDetails(bankDetails);
            toast.success('Bank details updated');
            setShowBankForm(false);
            fetchData();
        } catch (error) {
            if (error instanceof ZodError) {
                error.issues.forEach((err) => toast.error(err.message));
            } else {
                toast.error('Failed to update bank details');
            }
        } finally {
            setIsUpdatingBank(false);
        }
    };

    if (loading && page === 1)
        return (
            <div className="flex min-h-screen bg-[#FDFCFE]">
                <div className="hidden md:block w-64 bg-white shadow-xl z-20">
                    <Sidebar />
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );

    const hasBankDetails = !!(wallet?.bankAccountDetails?.accountNumber && wallet?.bankAccountDetails?.bankName);

    return (
        <div className="flex min-h-screen bg-[#FDFCFE]">
            <div className="hidden md:block w-64 bg-white shadow-xl z-20">
                <Sidebar />
            </div>

            <main className="flex-1 min-h-screen overflow-y-auto px-6 py-8 md:px-12">
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                                My Wallet
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Manage your balance, transactions, and bank details
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                            <Clock size={14} />
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>

                    {/* Top Section: Balance & Bank */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Balance Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-purple-200 relative overflow-hidden group"
                        >
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <p className="text-purple-100 text-sm font-black uppercase tracking-widest mb-2 opacity-80">
                                                Available Balance
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <IndianRupee size={40} strokeWidth={3} />
                                                <span className="text-6xl font-black">
                                                    {wallet?.balance || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                                            <Wallet size={32} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-1">
                                                Pending Refunds
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <IndianRupee size={14} className="opacity-70" />
                                                <span className="text-xl font-bold">
                                                    {wallet?.pendingBalance || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-1">
                                                Total Spent
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <IndianRupee size={14} className="opacity-70" />
                                                <span className="text-xl font-bold">
                                                    {transactions
                                                        ?.filter(t => t.type === 'payment')
                                                        .reduce((acc, t) => acc + t.amount, 0) || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/15 transition-colors" />
                            <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
                        </motion.div>

                        {/* Bank Details Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col"
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <CreditCard className="text-purple-600" size={20} />
                                Bank Account
                            </h3>

                            <div className="flex-1">
                                {hasBankDetails && !showBankForm ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 relative overflow-hidden group">
                                            <div className="relative z-10">
                                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">
                                                    Bank Name
                                                </p>
                                                <p className="font-bold text-slate-700">{wallet?.bankAccountDetails?.bankName}</p>
                                            </div>
                                            <CheckCircle2 size={40} className="absolute -right-4 -bottom-4 text-purple-200/40 rotate-12 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                Account Number
                                            </p>
                                            <p className="font-bold text-slate-700 tracking-wide">
                                                •••• {wallet?.bankAccountDetails?.accountNumber.slice(-4)}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                Account Holder
                                            </p>
                                            <p className="font-bold text-slate-700 capitalize">{wallet?.bankAccountDetails?.accountHolderName}</p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setShowBankForm(true)}
                                            className="w-full mt-4 py-3 text-purple-600 text-sm font-bold border-2 border-purple-100 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            Edit Details
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {!hasBankDetails && (
                                            <div className="text-center py-4 px-2">
                                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Plus size={24} />
                                                </div>
                                                <p className="text-sm font-medium text-slate-600">No bank account linked</p>
                                                <p className="text-[10px] text-slate-400 mt-1">Add your bank details to receive refunds</p>
                                            </div>
                                        )}
                                        
                                        <div className="space-y-3">
                                            <input
                                                placeholder="Account Holder Name"
                                                className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 outline-none text-sm font-medium transition-all"
                                                value={bankDetails.accountHolderName}
                                                onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                                            />
                                            <input
                                                placeholder="Account Number"
                                                className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 outline-none text-sm font-medium transition-all"
                                                value={bankDetails.accountNumber}
                                                onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                                            />
                                            <input
                                                placeholder="Bank Name"
                                                className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 outline-none text-sm font-medium transition-all"
                                                value={bankDetails.bankName}
                                                onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                                            />
                                            <input
                                                placeholder="IFSC Code"
                                                className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 outline-none text-sm font-medium uppercase transition-all"
                                                value={bankDetails.ifscCode}
                                                onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                                            />
                                            <div className="flex gap-2 mt-4">
                                                {hasBankDetails && (
                                                    <button 
                                                        onClick={() => setShowBankForm(false)}
                                                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleUpdateBankDetails}
                                                    disabled={isUpdatingBank}
                                                    className="flex-[2] py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-purple-100"
                                                >
                                                    {isUpdatingBank ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : 'Save Account'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Transactions Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">
                                Transaction History
                            </h3>
                            <button className="text-purple-600 text-xs font-black uppercase tracking-widest hover:underline">
                                Export History
                            </button>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {transactions.length === 0 ? (
                                <div className="p-20 text-center">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Clock size={32} />
                                    </div>
                                    <p className="text-slate-500 font-bold text-lg">No transactions yet</p>
                                    <p className="text-slate-400 text-sm mt-1">Your transaction history will appear here.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {transactions.map((tx) => (
                                                <motion.div
                                                    layout
                                                    key={tx._id}
                                                    className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50/80 rounded-3xl transition-colors border border-transparent hover:border-slate-100"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`p-4 rounded-2xl ${
                                                                tx.type === 'earning' || tx.type === 'refund' 
                                                                    ? 'bg-green-100 text-green-600' 
                                                                    : 'bg-orange-100 text-orange-600'
                                                            }`}
                                                        >
                                                            {tx.type === 'earning' || tx.type === 'refund' ? (
                                                                <ArrowDownCircle size={22} />
                                                            ) : (
                                                                <ArrowUpCircle size={22} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-base">
                                                                {tx.description}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                    {new Date(tx.date).toLocaleDateString(undefined, {
                                                                        day: '2-digit',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                                <span className={`text-[10px] font-black uppercase ${
                                                                    tx.status === 'completed' ? 'text-green-500' : 'text-orange-500'
                                                                }`}>
                                                                    {tx.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-black ${
                                                            tx.type === 'earning' || tx.type === 'refund' 
                                                                ? 'text-green-600' 
                                                                : 'text-orange-600'
                                                        }`}>
                                                            {tx.type === 'earning' || tx.type === 'refund' ? '+' : '-'}{' '}
                                                            ₹{tx.amount}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                                                            {tx.type}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                                            <p className="text-sm font-bold text-slate-400">
                                                Page <span className="text-purple-600">{page}</span> of {totalPages}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                                    disabled={page === 1}
                                                    className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:border-purple-200 hover:text-purple-600 transition-all shadow-sm"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <div className="flex gap-1">
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setPage(i + 1)}
                                                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                                                                page === i + 1 
                                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                                                                    : 'bg-white text-slate-400 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={page === totalPages}
                                                    className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:border-purple-200 hover:text-purple-600 transition-all shadow-sm"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserWalletPage;
