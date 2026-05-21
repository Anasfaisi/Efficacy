import React, { useEffect, useState } from 'react';
import { walletApi } from '@/Services/wallet.api';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    IndianRupee,
    Clock,
    ChevronLeft,
    ChevronRight,
    Info,
    Lock,
    CheckCircle,
    AlertCircle,
    Building2,
    Sparkles,
    Banknote,
    HelpCircle,
    ExternalLink,
    Check,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const MentorWalletPage: React.FC = () => {
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(6);
    
    // Tab filtering for transactions: 'all', 'earning', 'withdrawal', 'refund'
    const [activeTab, setActiveTab] = useState<'all' | 'earning' | 'withdrawal' | 'refund'>('all');

    // Bank Details state
    const [bankDetails, setBankDetails] = useState({
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        accountHolderName: '',
    });
    const [isSavingBank, setIsSavingBank] = useState(false);
    const [isBankEditing, setIsBankEditing] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Simulated Stripe Connect State
    const [isStripeLoading, setIsStripeLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [walletData, txData] = await Promise.all([
                walletApi.getWallet(),
                walletApi.getTransactions(page, limit),
            ]);
            setWallet(walletData);
            setTransactions(txData.transactions);
            setTotalPages(txData.totalPages);

            if (walletData?.bankAccountDetails) {
                setBankDetails({
                    accountNumber: walletData.bankAccountDetails.accountNumber || '',
                    bankName: walletData.bankAccountDetails.bankName || '',
                    ifscCode: walletData.bankAccountDetails.ifscCode || '',
                    accountHolderName: walletData.bankAccountDetails.accountHolderName || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to load wallet data';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleWithdraw = async () => {
        const amt = Number(withdrawAmount);
        if (!withdrawAmount || isNaN(amt) || amt < 500) {
            toast.error('Minimum withdrawal amount is ₹500');
            return;
        }
        if (amt > (wallet?.balance || 0)) {
            toast.error('Insufficient available balance');
            return;
        }

        setIsWithdrawing(true);
        try {
            await walletApi.requestWithdrawal(amt);
            toast.success('Withdrawal request submitted successfully! Funds will clear in 24-48h.');
            setWithdrawAmount('');
            setIsWithdrawModalOpen(false);
            fetchData();
        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Withdrawal failed';
            toast.error(errorMessage);
        } finally {
            setIsWithdrawing(false);
        }
    };

    const handleSaveBankDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bankDetails.accountHolderName || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
            toast.error('Please fill out all bank account fields');
            return;
        }
        
        setIsSavingBank(true);
        try {
            await walletApi.updateBankDetails(bankDetails);
            toast.success('Direct Deposit Bank details updated successfully!');
            setIsBankEditing(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to update bank details');
        } finally {
            setIsSavingBank(false);
        }
    };

    const handleStripeConnect = async () => {
        setIsStripeLoading(true);
        toast.loading('Redirecting to Stripe Express onboarding...');
        
    //     setTimeout(() => {
    //         // toast.dismiss();
    //         // toast.success('Stripe Connect Mock Integration complete! Wallet linked successfully.');
    //         // Update local state to mock onboarded
    //         setWallet((prev: any) => ({
    //             ...prev,
    //             stripeConnectOnboarded: true,
    //             stripeConnectAccountId: 'acct_1tMockStripeExpress77'
    //         }));
    //         setIsStripeLoading(false);
    //     }, 1800);
       try {
         const stripeAccountUrl = await walletApi.onboardStripeConnect()
         console.log(stripeAccountUrl,"from the mentor walle page")
         if(stripeAccountUrl){
            window.location.href = stripeAccountUrl
setIsStripeLoading(false);
         }
       } catch (error) {
        toast.error(error as string)
       }
    };

    // Calculate aggregated metrics from wallet and transaction history
    const allTxs = wallet?.transactions || [];
    const lifetimeEarnings = allTxs
        .filter((t: any) => t.type === 'earning')
        .reduce((acc: number, t: any) => acc + t.amount, 0) || 0;
    
    const totalWithdrawn = allTxs
        .filter((t: any) => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((acc: number, t: any) => acc + t.amount, 0) || 0;

    // Filter transactions for display in table based on ledger tabs
    const filteredTransactions = transactions.filter((tx: any) => {
        if (activeTab === 'all') return true;
        return tx.type === activeTab;
    });

    if (loading && !wallet) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-violet-600 w-10 h-10" />
                    <p className="text-zinc-500 font-semibold text-sm animate-pulse">Loading secure payout dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[76rem] mx-auto space-y-8 pb-20 px-4">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-violet-50 text-violet-700 text-xs font-bold rounded-full border border-violet-100 uppercase tracking-wider">
                            Financial Hub
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                        Payouts & Wallet
                    </h1>
                    <p className="text-zinc-500 font-medium text-sm mt-1">
                        Manage your mentorship balances, bank details, and withdraw cleared earnings.
                    </p>
                </div>
                
                <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    disabled={!wallet || (wallet.balance || 0) < 500}
                    className="flex items-center gap-2 px-6 py-3.5 bg-zinc-950 text-white hover:bg-zinc-800 text-sm font-black rounded-xl transition-all shadow-lg active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer animate-in fade-in zoom-in duration-300"
                >
                    <Banknote size={16} />
                    Request Payout
                </button>
            </div>

            {/* STRIPE CONNECT CALLOUT BANNER */}
            {!wallet?.stripeConnectOnboarded ? (
                <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="max-w-2xl space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md text-xs font-bold text-violet-100 border border-white/10 uppercase tracking-widest">
                                <Sparkles size={12} className="text-yellow-300 animate-pulse" /> Highly Recommended
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">
                                Get Paid Instantly via Stripe Express
                            </h2>
                            <p className="text-violet-100 text-sm font-medium leading-relaxed">
                                Avoid manual withdrawals entirely. Connect your account via Stripe Connect to transfer earnings directly to your bank account within minutes of session completion. 
                            </p>
                        </div>
                        
                        <button
                            onClick={handleStripeConnect}
                            disabled={isStripeLoading}
                            className="w-full lg:w-auto px-6 py-4 bg-white text-zinc-900 hover:bg-violet-50 font-black rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 text-sm cursor-pointer whitespace-nowrap"
                        >
                            {isStripeLoading ? (
                                <Loader2 className="animate-spin w-4 h-4 text-violet-600" />
                            ) : (
                                <>
                                    <Sparkles size={16} className="text-violet-600" />
                                    Connect Stripe Account
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500 text-white rounded-2xl">
                            <CheckCircle size={22} />
                        </div>
                        <div>
                            <h3 className="font-black text-emerald-950 text-sm">Stripe Automated Payouts Connected</h3>
                            <p className="text-emerald-700 text-xs font-semibold">
                                Connected to account {wallet?.stripeConnectAccountId}. Payouts will trigger automatically.
                            </p>
                        </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black uppercase text-emerald-600 tracking-wider">
                        Active <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    </span>
                </div>
            )}

            {/* METRICS GRID (Zinc styled 4-Column Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Available Balance */}
                <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-md shadow-zinc-100/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[170px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                                Available Balance 
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                            </p>
                            <div className="flex items-baseline mt-2 text-zinc-900">
                                <span className="text-xl font-bold text-zinc-500 mr-0.5">₹</span>
                                <span className="text-4xl font-black tracking-tight">{wallet?.balance || 0}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Wallet size={20} />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase">Manual Payout Fallback</span>
                        <button
                            onClick={() => setIsWithdrawModalOpen(true)}
                            disabled={(wallet?.balance || 0) < 500}
                            className="text-xs font-black text-violet-600 hover:text-violet-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                        >
                            Withdraw <ArrowUpRight size={12} />
                        </button>
                    </div>
                </div>

                {/* 2. Pending Escrow */}
                <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-md shadow-zinc-100/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[170px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="relative flex items-center gap-1">
                                <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">
                                    Pending in Escrow
                                </p>
                                <div 
                                    className="cursor-pointer text-zinc-300 hover:text-zinc-500 relative"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <HelpCircle size={14} />
                                    {showTooltip && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 bg-zinc-950 text-white text-[10px] font-medium leading-relaxed p-3 rounded-xl shadow-2xl border border-zinc-800 z-50 animate-in fade-in-20 duration-150">
                                            Funds are temporarily held in secure Stripe/Platform escrow and automatically clear to your available balance 30 days after the mentorship session.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-baseline mt-2 text-zinc-900">
                                <span className="text-xl font-bold text-zinc-500 mr-0.5">₹</span>
                                <span className="text-4xl font-black tracking-tight">{wallet?.pendingBalance || 0}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-zinc-50 text-zinc-600 rounded-2xl">
                            <Lock size={20} />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-50">
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase flex items-center gap-1">
                            <Clock size={10} /> Clears after 30 days
                        </span>
                    </div>
                </div>

                {/* 3. Lifetime Earnings */}
                <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-md shadow-zinc-100/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[170px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">
                                Lifetime Earnings
                            </p>
                            <div className="flex items-baseline mt-2 text-zinc-900">
                                <span className="text-xl font-bold text-zinc-500 mr-0.5">₹</span>
                                <span className="text-4xl font-black tracking-tight">{lifetimeEarnings}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                            <Sparkles size={20} />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-50">
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase">Total Revenue Generated</span>
                    </div>
                </div>

                {/* 4. Total Withdrawn */}
                <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-md shadow-zinc-100/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[170px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">
                                Total Withdrawn
                            </p>
                            <div className="flex items-baseline mt-2 text-zinc-900">
                                <span className="text-xl font-bold text-zinc-500 mr-0.5">₹</span>
                                <span className="text-4xl font-black tracking-tight">{totalWithdrawn}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-zinc-100 text-zinc-800 rounded-2xl">
                            <Banknote size={20} />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-50">
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase">Transferred to Bank Account</span>
                    </div>
                </div>

            </div>

            {/* MIDDLE LAYOUT: Two columns (Bank Transfer Setup on left, Ledger/Transactions on right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT SIDE: Direct deposit bank setup */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-100 shadow-xl shadow-zinc-100/50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-zinc-50 text-zinc-800 rounded-xl">
                                    <Building2 size={18} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-zinc-950">Direct Deposit Details</h2>
                                    <p className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wide">Manual payout details</p>
                                </div>
                            </div>
                            
                            {!isBankEditing && (
                                <button
                                    onClick={() => setIsBankEditing(true)}
                                    className="text-xs font-black text-violet-600 hover:text-violet-800 cursor-pointer"
                                >
                                    Edit details
                                </button>
                            )}
                        </div>

                        {!isBankEditing && bankDetails.accountNumber ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100/60 divide-y divide-zinc-100">
                                    <div className="flex justify-between py-2.5 text-xs">
                                        <span className="text-zinc-400 font-bold uppercase">Account Holder</span>
                                        <span className="text-zinc-800 font-black">{bankDetails.accountHolderName}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5 text-xs">
                                        <span className="text-zinc-400 font-bold uppercase">Bank Name</span>
                                        <span className="text-zinc-800 font-black">{bankDetails.bankName}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5 text-xs">
                                        <span className="text-zinc-400 font-bold uppercase">Account Number</span>
                                        <span className="text-zinc-800 font-mono font-bold">
                                            •••• •••• {bankDetails.accountNumber.slice(-4)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2.5 text-xs">
                                        <span className="text-zinc-400 font-bold uppercase">IFSC Code</span>
                                        <span className="text-zinc-800 font-mono font-bold">{bankDetails.ifscCode}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-zinc-50 rounded-xl flex items-start gap-2 border border-zinc-100 text-[11px] font-medium text-zinc-500">
                                    <Info size={14} className="text-zinc-400 shrink-0 mt-0.5" />
                                    This bank account is used to verify and route direct deposit withdrawal requests securely.
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveBankDetails} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-1.5">
                                        Account Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter account holder name"
                                        value={bankDetails.accountHolderName}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-1.5">
                                            Bank Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. HDFC Bank"
                                            value={bankDetails.bankName}
                                            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-1.5">
                                            IFSC Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. HDFC0001234"
                                            value={bankDetails.ifscCode}
                                            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all font-mono"
                                            maxLength={11}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-1.5">
                                        Account Number
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter full account number"
                                        value={bankDetails.accountNumber}
                                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all font-mono"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    {bankDetails.accountNumber && (
                                        <button
                                            type="button"
                                            onClick={() => setIsBankEditing(false)}
                                            className="flex-1 py-3 border border-zinc-200 text-zinc-600 text-xs font-black rounded-xl hover:bg-zinc-50 transition-all cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSavingBank}
                                        className="flex-1 py-3 bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSavingBank ? (
                                            <>
                                                <Loader2 className="animate-spin w-3.5 h-3.5" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={14} />
                                                Save Details
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Transaction Explorer */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-100/50 overflow-hidden">
                        
                        {/* Ledger Header */}
                        <div className="p-6 sm:p-8 border-b border-zinc-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-lg font-black text-zinc-950">Transaction Explorer</h2>
                                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Wallet Ledger</p>
                            </div>
                            
                            {/* Tab Filters with smooth background sliders */}
                            <div className="bg-zinc-50 p-1 rounded-xl flex gap-1 border border-zinc-100">
                                {(['all', 'earning', 'withdrawal', 'refund'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setPage(1); // Reset page on tab shift
                                        }}
                                        className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                                            activeTab === tab
                                                ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50'
                                                : 'text-zinc-400 hover:text-zinc-600'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ledger Rows */}
                        <div className="divide-y divide-zinc-50">
                            {filteredTransactions.length === 0 ? (
                                <div className="p-20 text-center flex flex-col items-center">
                                    <div className="p-4 bg-zinc-50 text-zinc-400 rounded-full mb-4">
                                        <Clock size={36} />
                                    </div>
                                    <h3 className="font-black text-zinc-700 text-sm uppercase">No Transactions Found</h3>
                                    <p className="text-zinc-400 text-xs font-semibold mt-1">There are no records matching the selected ledger filters.</p>
                                </div>
                            ) : (
                                <>
                                    {filteredTransactions.map((tx: any, idx: number) => (
                                        <div
                                            key={tx._id || idx}
                                            className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors animate-in fade-in duration-200"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`p-3 rounded-2xl ${
                                                        tx.type === 'earning' 
                                                            ? 'bg-emerald-50 text-emerald-600' 
                                                            : tx.type === 'withdrawal'
                                                            ? 'bg-amber-50 text-amber-600'
                                                            : 'bg-zinc-100 text-zinc-600'
                                                    }`}
                                                >
                                                    {tx.type === 'earning' ? (
                                                        <ArrowDownLeft size={20} />
                                                    ) : (
                                                        <ArrowUpRight size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-800 text-sm">
                                                        {tx.description}
                                                    </p>
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">
                                                        {new Date(tx.date).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right flex flex-col items-end gap-1.5">
                                                <p
                                                    className={`font-black text-sm ${
                                                        tx.type === 'earning' ? 'text-emerald-600' : 'text-amber-600'
                                                    }`}
                                                >
                                                    {tx.type === 'earning' ? '+' : '-'} ₹{tx.amount}
                                                </p>
                                                <span
                                                    className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                        tx.status === 'completed' 
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                            : tx.status === 'pending'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                                                    }`}
                                                >
                                                    {tx.status === 'pending' && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                                    )}
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination Ledger Controls */}
                                    {totalPages > 1 && (
                                        <div className="p-6 border-t border-zinc-50 flex items-center justify-between">
                                            <button
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="p-2 border border-zinc-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors cursor-pointer"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                                                Page {page} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="p-2 border border-zinc-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors cursor-pointer"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                </div>

            </div>

            {/* WITHDRAWAL DRAWER / MODAL OVERLAY */}
            <AnimatePresence>
                {isWithdrawModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        
                        {/* Glassmorphic Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsWithdrawModalOpen(false)}
                            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
                        />

                        {/* Modal Body */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white w-full max-w-md rounded-[2rem] p-6 sm:p-8 border border-zinc-100 shadow-2xl relative z-10 space-y-6"
                        >
                            
                            {/* Modal Header */}
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                                    <Banknote size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-zinc-950">Request Payout</h3>
                                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">Manual bank withdrawal</p>
                                </div>
                            </div>

                            {/* Alert for empty bank details */}
                            {!bankDetails.accountNumber && (
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
                                    <AlertCircle className="shrink-0 mt-0.5 text-amber-600" size={16} />
                                    <div>
                                        <p className="font-bold">Missing Bank Details</p>
                                        <p className="text-[11px] leading-relaxed mt-0.5">Please populate your Direct Deposit details in the main page before invoking withdrawals.</p>
                                    </div>
                                </div>
                            )}

                            {/* Payout Input Form */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-baseline mb-2 text-xs">
                                        <span className="font-black text-zinc-400 uppercase tracking-widest">Withdrawal Amount</span>
                                        <span className="font-bold text-zinc-500">Available: ₹{wallet?.balance || 0}</span>
                                    </div>
                                    
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            className="w-full pl-10 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xl font-black text-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all font-mono"
                                        />
                                    </div>
                                    
                                    <p className="text-[10px] text-zinc-400 mt-2 font-semibold uppercase flex items-center gap-1">
                                        <Info size={11} /> Minimum withdrawal: ₹500
                                    </p>
                                </div>

                                {/* Fast Presets */}
                                <div className="grid grid-cols-4 gap-2">
                                    {([500, 1000, 2500] as const).map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setWithdrawAmount(String(preset))}
                                            className="py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/50 text-[11px] font-black text-zinc-600 rounded-xl transition-all cursor-pointer"
                                        >
                                            ₹{preset}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawAmount(String(wallet?.balance || 0))}
                                        className="py-2.5 bg-violet-50 hover:bg-violet-100 border border-violet-200/50 text-[11px] font-black text-violet-600 rounded-xl transition-all cursor-pointer"
                                    >
                                        Max
                                    </button>
                                </div>

                                {/* Validation Warning Banner */}
                                {withdrawAmount && (Number(withdrawAmount) > (wallet?.balance || 0) || Number(withdrawAmount) < 500) && (
                                    <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-rose-800 text-[11px] font-bold">
                                        <AlertCircle className="shrink-0 text-rose-600" size={14} />
                                        <span>
                                            {Number(withdrawAmount) > (wallet?.balance || 0) 
                                                ? 'Amount exceeds available balance.' 
                                                : 'Amount must be at least ₹500.'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer CTA */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsWithdrawModalOpen(false)}
                                    className="flex-1 py-3.5 border border-zinc-200 text-zinc-600 text-xs font-black rounded-xl hover:bg-zinc-50 transition-all cursor-pointer"
                                >
                                    Close Panel
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={
                                        isWithdrawing || 
                                        !withdrawAmount || 
                                        !bankDetails.accountNumber ||
                                        Number(withdrawAmount) < 500 || 
                                        Number(withdrawAmount) > (wallet?.balance || 0)
                                    }
                                    className="flex-1 py-3.5 bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isWithdrawing ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={14} />
                                            Confirm Payout
                                        </>
                                    )}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default MentorWalletPage;
