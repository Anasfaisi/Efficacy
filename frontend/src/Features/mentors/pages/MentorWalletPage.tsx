import React, { useEffect, useState } from 'react';
import { walletApi } from '@/Services/wallet.api';
import {
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    IndianRupee,
    Clock,
    Plus,
    Building2,
} from 'lucide-react';
import { toast } from 'sonner';

const MentorWalletPage: React.FC = () => {
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const fetchData = async () => {
        try {
            const data = await walletApi.getWallet();
            setWallet(data);
        } catch (error) {
            console.error('Failed to fetch wallet:', error);
            toast.error('Failed to load wallet data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                                                (t: any) =>
                                                    t.type === 'earning',
                                            )
                                            .reduce(
                                                (acc: number, t: any) =>
                                                    acc + t.amount,
                                                0,
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bank Details */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">
                            Bank Account
                        </h3>
                        <button className="text-indigo-600 p-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                            <Plus size={18} />
                        </button>
                    </div>

                    {wallet?.bankAccountDetails?.accountNumber ? (
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <Building2
                                        className="text-gray-400"
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {wallet.bankAccountDetails.bankName}
                                    </p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {wallet.bankAccountDetails
                                            .accountType || 'Savings'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-lg font-black text-gray-700 tracking-widest">
                                **** ****{' '}
                                {wallet.bankAccountDetails.accountNumber.slice(
                                    -4,
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                            <Building2
                                className="mx-auto text-gray-200 mb-4"
                                size={40}
                            />
                            <p className="text-sm text-gray-500 font-medium mb-4">
                                No bank account linked
                            </p>
                            <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
                                Add Bank Details
                            </button>
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">
                            Recent Transactions
                        </h3>
                        <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {wallet?.transactions?.length === 0 ? (
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
                            wallet?.transactions?.slice(0, 5).map((tx: any) => (
                                <div
                                    key={tx._id}
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
                                                    tx.date,
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorWalletPage;
