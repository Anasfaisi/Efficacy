import React, { useEffect, useState } from 'react';
import { walletApi } from '@/Services/wallet.api';
import {
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    IndianRupee,
    Clock,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

const MentorWalletPage: React.FC = () => {
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(6);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [walletData, txData] = await Promise.all([
                walletApi.getWallet(),
                walletApi.getTransactions(page, limit)
            ]);
            setWallet(walletData);
            setTransactions(txData.transactions);
            setTotalPages(txData.totalPages);
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

    const handleWithdraw = async () => {
        if (!withdrawAmount || isNaN(Number(withdrawAmount))) return;
        setIsWithdrawing(true);
        try {
            await walletApi.requestWithdrawal(Number(withdrawAmount));
            toast.success('Withdrawal request submitted successfully!');
            setWithdrawAmount('');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Withdrawal failed');
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                    My Earnings
                </h1>
                <p className="text-gray-500 font-medium">
                    Manage your balance and withdrawals
                </p>
            </div>

            {/* Main Balance Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <p className="text-indigo-100 text-sm font-black uppercase tracking-widest mb-2 opacity-80">
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
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">
                                    Pending Clearance
                                </p>
                                <div className="flex items-center gap-1">
                                    <IndianRupee
                                        size={14}
                                        className="opacity-70"
                                    />
                                    <span className="text-xl font-bold">
                                        {wallet?.pendingBalance || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">
                                    Life Time Earnings
                                </p>
                                <div className="flex items-center gap-1">
                                    <IndianRupee
                                        size={14}
                                        className="opacity-70"
                                    />
                                    <span className="text-xl font-bold">
                                        {wallet?.transactions
                                            ?.filter(
                                                (t: any) => t.type === 'earning'
                                            )
                                            .reduce(
                                                (acc: number, t: any) =>
                                                    acc + t.amount,
                                                0
                                            ) || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/15 transition-colors" />
                    <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ArrowUpCircle
                                className="text-indigo-600"
                                size={20}
                            />
                            Request Withdrawal
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                    Amount to Withdraw
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <IndianRupee size={18} />
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        value={withdrawAmount}
                                        onChange={(e) =>
                                            setWithdrawAmount(e.target.value)
                                        }
                                        max={wallet?.balance}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                    Minimum withdrawal: ₹500
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={
                            isWithdrawing ||
                            !withdrawAmount ||
                            Number(withdrawAmount) > (wallet?.balance || 0)
                        }
                        onClick={handleWithdraw}
                        className="w-full mt-8 py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-indigo-100"
                    >
                        {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">
                            Recent Transactions
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {transactions.length === 0 ? (
                            <div className="p-20 text-center">
                                <Clock
                                    className="mx-auto text-gray-200 mb-4"
                                    size={40}
                                />
                                <p className="text-gray-500 font-medium">
                                    No transactions yet
                                </p>
                            </div>
                        ) : (
                            <>
                            {transactions.map((tx: any, idx: number) => (
                                <div
                                    key={tx._id || idx}
                                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-3 rounded-2xl ${tx.type === 'earning' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}
                                        >
                                            {tx.type === 'earning' ? (
                                                <ArrowDownCircle size={20} />
                                            ) : (
                                                <ArrowUpCircle size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {tx.description}
                                            </p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {new Date(
                                                    tx.date
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-black ${tx.type === 'earning' ? 'text-green-600' : 'text-orange-600'}`}
                                        >
                                            {tx.type === 'earning' ? '+' : '-'}{' '}
                                            ₹{tx.amount}
                                        </p>
                                        <span
                                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${tx.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}
                                        >
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {totalPages > 1 && (
                                <div className="p-6 border-t border-gray-50 flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="text-sm font-bold text-gray-600">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorWalletPage;
