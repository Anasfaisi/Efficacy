import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '@/Services/admin.api';
import {
    IndianRupee,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    Building2,
    User,
    Search,
    Check,
    X,
    Bell,
    ArrowUpRight,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminTransaction {
    walletId: string;
    transactionId: string;
    amount: number;
    type: 'earning' | 'withdrawal' | 'refund' | 'payment';
    status: 'pending' | 'completed' | 'failed';
    description: string;
    date: string;
    mentor?: {
        name: string;
        email: string;
    };
    user?: {
        name: string;
        email: string;
    };
    bankAccountDetails?: {
        accountNumber: string;
        bankName: string;
        ifscCode: string;
        accountHolderName: string;
    };
    stripeConnectAccountId?: string;
    stripeConnectOnboarded?: boolean;
}

const AdminPayoutsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const deepLinkedTxId = searchParams.get('transactionId');

    const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Modal state
    const [confirmModal, setConfirmModal] = useState<{
        type: 'approve' | 'reject';
        tx: AdminTransaction;
    } | null>(null);

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<
        'pending' | 'completed' | 'failed' | 'all'
    >('pending');

    // Pagination
    const [page] = useState(1);
    const [, setTotalCount] = useState(0);
    const limit = 50; // Use a high limit for cleaner client-side filtering/view of payouts

    const fetchPayoutRequests = async () => {
        try {
            setLoading(true);
            // Fetch mentor transactions specifically
            const data = await adminService.getTransactions(
                page,
                limit,
                'mentor'
            );

            // Filter only withdrawal requests
            const withdrawals = (
                (data.transactions as AdminTransaction[]) || []
            )
                .map((tx: AdminTransaction) => ({
                    ...tx,
                    // If backend aggregate has mapped it, map keys nicely
                    walletId: tx.walletId,
                    transactionId: tx.transactionId || tx._id,
                }))
                .filter((tx: AdminTransaction) => tx.type === 'withdrawal');

            setTransactions(withdrawals);
            setTotalCount(withdrawals.length);
        } catch (error: unknown) {
            console.error('Error fetching payouts:', error);
            toast.error('Failed to load payout requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayoutRequests();
    }, [page]);

    // Handle Deep-linked Transaction selection
    const deepLinkedTx = transactions.find(
        (t) => t.transactionId === deepLinkedTxId
    );

    // Filter transactions locally for quick interactive feel
    const filteredTransactions = transactions.filter((tx) => {
        // Tab filtering
        if (activeTab !== 'all' && tx.status !== activeTab) {
            return false;
        }

        // Search filtering (Mentor name, email, or amount)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const mentorName = tx.mentor?.name?.toLowerCase() || '';
            const mentorEmail = tx.mentor?.email?.toLowerCase() || '';
            const amountStr = tx.amount.toString();
            return (
                mentorName.includes(query) ||
                mentorEmail.includes(query) ||
                amountStr.includes(query)
            );
        }

        return true;
    });

    const handleApprove = async (tx: AdminTransaction) => {
        setProcessingId(tx.transactionId);
        setConfirmModal(null);
        try {
            const response = await adminService.approveWithdrawal(
                tx.walletId,
                tx.transactionId
            );
            toast.success(
                response.message ||
                    'Payout approved and funds transferred successfully.'
            );
            // Refresh list
            await fetchPayoutRequests();
        } catch (error: unknown) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ||
                'Failed to approve payout request.';
            toast.error(errorMessage);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (tx: AdminTransaction) => {
        setProcessingId(tx.transactionId);
        setConfirmModal(null);
        try {
            const response = await adminService.rejectWithdrawal(
                tx.walletId,
                tx.transactionId
            );
            toast.success(
                response.message ||
                    'Payout request rejected and balance refunded.'
            );
            // Refresh list
            await fetchPayoutRequests();
        } catch (error: unknown) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ||
                'Failed to reject payout request.';
            toast.error(errorMessage);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Mentor Payout Requests
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-3xl">
                        Authorize, track, and manage withdrawal requests from
                        mentors. Automatically process payouts securely through
                        onboarded Stripe Express Connect accounts, or review
                        verified bank details for manual payments.
                    </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                    <button
                        onClick={fetchPayoutRequests}
                        className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition-all rounded-xl"
                    >
                        Refresh Requests
                    </button>
                </div>
            </div>

            {/* Deep-Linked Transaction Panel */}
            {deepLinkedTxId && (
                <div className="mb-6">
                    {loading ? (
                        <div className="animate-pulse bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 h-28" />
                    ) : deepLinkedTx ? (
                        <motion.div
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border-2 border-indigo-500 rounded-3xl p-6 shadow-md shadow-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-indigo-600/10 text-indigo-600 rounded-2xl mt-1">
                                    <Bell
                                        className="animate-bounce"
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                                            Highlighted Request
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            ID:{' '}
                                            {deepLinkedTx.transactionId.substring(
                                                0,
                                                8
                                            )}
                                            ...
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mt-1">
                                        {deepLinkedTx.mentor?.name || 'Mentor'}{' '}
                                        Payout PENDING
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Amount:{' '}
                                        <span className="font-semibold text-indigo-700">
                                            ₹{deepLinkedTx.amount}
                                        </span>{' '}
                                        • Requested on{' '}
                                        {new Date(
                                            deepLinkedTx.date
                                        ).toLocaleDateString(undefined, {
                                            dateStyle: 'medium',
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                {deepLinkedTx.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                setConfirmModal({
                                                    type: 'reject',
                                                    tx: deepLinkedTx,
                                                })
                                            }
                                            disabled={processingId !== null}
                                            className="px-4 py-2.5 text-sm font-bold bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 active:scale-95 transition-all rounded-xl shadow-sm"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() =>
                                                setConfirmModal({
                                                    type: 'approve',
                                                    tx: deepLinkedTx,
                                                })
                                            }
                                            disabled={processingId !== null}
                                            className="px-5 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition-all rounded-xl shadow-md flex items-center gap-2"
                                        >
                                            {processingId ===
                                            deepLinkedTx.transactionId ? (
                                                <Loader2
                                                    className="animate-spin"
                                                    size={16}
                                                />
                                            ) : (
                                                <Check size={16} />
                                            )}
                                            Approve & Payout
                                        </button>
                                    </>
                                ) : (
                                    <span
                                        className={`px-4 py-2 rounded-xl text-sm font-bold uppercase ${
                                            deepLinkedTx.status === 'completed'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-rose-100 text-rose-700'
                                        }`}
                                    >
                                        Already {deepLinkedTx.status}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-sm flex items-center gap-3">
                            <AlertCircle
                                size={20}
                                className="text-amber-600 flex-shrink-0"
                            />
                            <span>
                                The deep-linked transaction ID{' '}
                                <strong>{deepLinkedTxId}</strong> was not found
                                in the recent list or is not a pending mentor
                                withdrawal.
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Filter Tabs and Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex border-b lg:border-none border-gray-100 pb-2 lg:pb-0 gap-1 overflow-x-auto">
                    {(['pending', 'completed', 'failed', 'all'] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap capitalize transition-all duration-200 ${
                                    activeTab === tab
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                                        : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {tab === 'all'
                                    ? 'All Payouts'
                                    : `${tab} requests`}
                            </button>
                        )
                    )}
                </div>

                <div className="relative max-w-md w-full">
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search by mentor name, email, amount..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm outline-none transition-all"
                    />
                </div>
            </div>

            {/* Main Payout Requests Listing */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="animate-pulse bg-white border border-gray-100 rounded-3xl p-6 h-64 shadow-sm"
                        />
                    ))}
                </div>
            ) : filteredTransactions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTransactions.map((tx) => {
                        const isStripeOnboarded =
                            tx.stripeConnectAccountId &&
                            tx.stripeConnectOnboarded;
                        const isHighlighted =
                            tx.transactionId === deepLinkedTxId;

                        return (
                            <motion.div
                                layout
                                key={tx.transactionId}
                                className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md hover:border-gray-200 ${
                                    isHighlighted
                                        ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/10'
                                        : 'border-gray-100'
                                }`}
                            >
                                {/* Top Header Info */}
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 ${
                                                    tx.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                                                        : tx.status ===
                                                            'completed'
                                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                                                          : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                                                }`}
                                            >
                                                {tx.status === 'pending' && (
                                                    <Clock size={12} />
                                                )}
                                                {tx.status === 'completed' && (
                                                    <CheckCircle2 size={12} />
                                                )}
                                                {tx.status === 'failed' && (
                                                    <XCircle size={12} />
                                                )}
                                                {tx.status}
                                            </span>
                                            {isHighlighted && (
                                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200/50 px-2 py-0.5 rounded-full">
                                                    Linked Request
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(
                                                tx.date
                                            ).toLocaleDateString(undefined, {
                                                dateStyle: 'medium',
                                            })}
                                        </span>
                                    </div>

                                    {/* User Details & Amount */}
                                    <div className="mt-4 flex justify-between items-start gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2.5 bg-gray-100 text-gray-600 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-gray-900 text-base leading-snug">
                                                    {tx.mentor?.name ||
                                                        'Mentor Profile'}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {tx.mentor?.email ||
                                                        'No email associated'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors justify-end">
                                                <IndianRupee size={18} />
                                                <span>
                                                    {tx.amount.toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                                                Withdrawal
                                            </p>
                                        </div>
                                    </div>

                                    {/* Settlement details (Stripe Connect or Bank Account Details) */}
                                    <div className="mt-6 border-t border-gray-100 pt-5 space-y-4">
                                        {/* Stripe Connect Express Check */}
                                        <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                                            <span className="font-medium text-gray-500">
                                                Stripe Payout Capability
                                            </span>
                                            {isStripeOnboarded ? (
                                                <span className="font-bold text-emerald-700 flex items-center gap-1">
                                                    <CheckCircle2
                                                        size={14}
                                                        className="fill-emerald-50 text-emerald-600"
                                                    />
                                                    Express Connected
                                                </span>
                                            ) : (
                                                <span className="font-bold text-amber-700 flex items-center gap-1">
                                                    <AlertCircle
                                                        size={14}
                                                        className="fill-amber-50 text-amber-600"
                                                    />
                                                    Manual Required
                                                </span>
                                            )}
                                        </div>

                                        {/* Bank Details section */}
                                        {tx.bankAccountDetails && (
                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2.5">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold border-b border-gray-200/50 pb-2">
                                                    <Building2
                                                        size={14}
                                                        className="text-gray-500"
                                                    />
                                                    <span>
                                                        Registered Bank Account
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                                                    <div>
                                                        <span className="text-gray-400 block mb-0.5">
                                                            Holder Name
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            {tx
                                                                .bankAccountDetails
                                                                .accountHolderName ||
                                                                'N/A'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block mb-0.5">
                                                            Bank Name
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            {tx
                                                                .bankAccountDetails
                                                                .bankName ||
                                                                'N/A'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block mb-0.5">
                                                            Account Number
                                                        </span>
                                                        <span className="font-semibold text-gray-900 tracking-wider">
                                                            {tx
                                                                .bankAccountDetails
                                                                .accountNumber ||
                                                                'N/A'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block mb-0.5">
                                                            IFSC Code
                                                        </span>
                                                        <span className="font-semibold text-gray-900 tracking-wide uppercase">
                                                            {tx
                                                                .bankAccountDetails
                                                                .ifscCode ||
                                                                'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Actions block */}
                                {tx.status === 'pending' && (
                                    <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                                        <button
                                            onClick={() =>
                                                setConfirmModal({
                                                    type: 'reject',
                                                    tx,
                                                })
                                            }
                                            disabled={processingId !== null}
                                            className="flex-1 py-3 text-xs font-extrabold bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 active:scale-98 transition-all rounded-2xl shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <X size={14} />
                                            Reject & Refund
                                        </button>
                                        <button
                                            onClick={() =>
                                                setConfirmModal({
                                                    type: 'approve',
                                                    tx,
                                                })
                                            }
                                            disabled={processingId !== null}
                                            className="flex-1 py-3 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white active:scale-98 transition-all rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            {processingId ===
                                            tx.transactionId ? (
                                                <Loader2
                                                    className="animate-spin"
                                                    size={14}
                                                />
                                            ) : (
                                                <Check size={14} />
                                            )}
                                            {isStripeOnboarded
                                                ? 'Stripe Transfer'
                                                : 'Approve Payout'}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm max-w-xl mx-auto space-y-4">
                    <div className="h-16 w-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                        <ArrowUpRight size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                            No payout requests found
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                            We couldn't find any withdrawal requests matching
                            the active tab or search filters.
                        </p>
                    </div>
                    {activeTab !== 'pending' && (
                        <button
                            onClick={() => {
                                setActiveTab('pending');
                                setSearchQuery('');
                            }}
                            className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all active:scale-95"
                        >
                            View Pending Requests
                        </button>
                    )}
                </div>
            )}

            {/* Custom Tailwind UI glassmorphism Modals for confirm */}
            <AnimatePresence>
                {confirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal(null)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100 relative z-10 space-y-6"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`p-3 rounded-2xl ${
                                        confirmModal.type === 'approve'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-rose-50 text-rose-600'
                                    }`}
                                >
                                    {confirmModal.type === 'approve' ? (
                                        <CheckCircle2 size={24} />
                                    ) : (
                                        <AlertCircle size={24} />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-extrabold text-gray-900 text-lg leading-tight">
                                        {confirmModal.type === 'approve'
                                            ? 'Confirm Payout Approval'
                                            : 'Confirm Payout Rejection'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Transaction ID:{' '}
                                        {confirmModal.tx.transactionId.substring(
                                            0,
                                            8
                                        )}
                                        ...
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                                <div className="flex justify-between items-center text-sm border-b border-gray-200/50 pb-2.5">
                                    <span className="text-gray-500">
                                        Requested Amount
                                    </span>
                                    <span className="font-black text-gray-950 text-base flex items-center">
                                        <IndianRupee size={15} />
                                        {confirmModal.tx.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">
                                        Mentor Name
                                    </span>
                                    <span className="font-semibold text-gray-950">
                                        {confirmModal.tx.mentor?.name}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed">
                                {confirmModal.type === 'approve' ? (
                                    confirmModal.tx.stripeConnectAccountId &&
                                    confirmModal.tx.stripeConnectOnboarded ? (
                                        <span>
                                            This request will trigger an{' '}
                                            <strong>
                                                automatic Stripe Express
                                                transfer
                                            </strong>{' '}
                                            of ₹{confirmModal.tx.amount} to the
                                            mentor's connected Stripe account.
                                            This action cannot be reversed.
                                        </span>
                                    ) : (
                                        <span>
                                            Since the mentor has not connected a
                                            Stripe Express account, you must
                                            transfer{' '}
                                            <strong>
                                                ₹{confirmModal.tx.amount}{' '}
                                                manually
                                            </strong>{' '}
                                            to their registered bank account.
                                            Approving will update their status
                                            to Completed and record this in
                                            their transaction history.
                                        </span>
                                    )
                                ) : (
                                    <span>
                                        Rejecting this request will mark the
                                        transaction as failed. The requested
                                        amount of{' '}
                                        <strong>
                                            ₹{confirmModal.tx.amount} will be
                                            instantly refunded
                                        </strong>{' '}
                                        to the mentor's available balance.
                                    </span>
                                )}
                            </p>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="flex-1 py-3 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all cursor-pointer text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirmModal.type === 'approve') {
                                            handleApprove(confirmModal.tx);
                                        } else {
                                            handleReject(confirmModal.tx);
                                        }
                                    }}
                                    className={`flex-1 py-3 text-xs font-extrabold text-green-50 rounded-2xl transition-all active:scale-98 cursor-pointer text-center ${
                                        confirmModal.type === 'approve'
                                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100'
                                            : 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-100'
                                    }`}
                                >
                                    {confirmModal.type === 'approve'
                                        ? 'Yes, Approve Payout'
                                        : 'Yes, Reject Request'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPayoutsPage;
