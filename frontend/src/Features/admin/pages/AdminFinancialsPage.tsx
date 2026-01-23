import { useEffect, useState } from 'react';
import { adminService } from '@/Services/admin.api';
import { IndianRupee, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

const AdminFinancialsPage = () => {
    const [revenue, setRevenue] = useState<{ totalRevenue: number } | null>(
        null
    );
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<'all' | 'mentor' | 'user'>('all');
    const [totalTransactions, setTotalTransactions] = useState(0);
    const limit = 10;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const txData = await adminService.getTransactions(
                    page,
                    limit,
                    filter
                );
                setTransactions(txData.transactions || []);
                setTotalTransactions(txData.total || 0);
            } catch (error) {
                toast.error('Failed to load transactions');
            }
        };

        // Only fetch revenue once on mount
        const fetchRevenue = async () => {
            try {
                const revData = await adminService.getRevenueDetails();
                setRevenue(revData);
            } catch (error) {
                console.error(error);
            }
        };

        if (loading) {
            Promise.all([fetchRevenue(), fetchTransactions()]).finally(() =>
                setLoading(false)
            );
        } else {
            fetchTransactions();
        }
    }, [page, filter]);

    const totalPages = Math.ceil(totalTransactions / limit);

    if (loading)
        return (
            <div className="p-8 text-center text-gray-500">
                Loading financials...
            </div>
        );

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">
                Financial Reports
            </h1>

            {/* Revenue Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <IndianRupee size={28} />
                        </div>
                        <div>
                            <p className="text-green-100 text-sm font-medium">
                                Total Platform Revenue
                            </p>
                            <h2 className="text-3xl font-bold mt-1">
                                ₹{revenue?.totalRevenue || 0}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">
                        Recent Transactions
                    </h3>
                    <div className="flex gap-2">
                        {(['all', 'mentor', 'user'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => {
                                    setFilter(f);
                                    setPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                                    filter === f
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {f === 'all' ? 'All Transactions' : f + 's'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 font-bold">Details</th>
                                <th className="px-6 py-4 font-bold">
                                    Mentor/User
                                </th>
                                <th className="px-6 py-4 font-bold">Date</th>
                                <th className="px-6 py-4 font-bold text-right">
                                    Amount
                                </th>
                                <th className="px-6 py-4 font-bold text-center">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.length > 0 ? (
                                transactions.map((tx: any) => (
                                    <tr
                                        key={tx._id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg ${tx.type === 'earning' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                                >
                                                    {tx.type === 'earning' ? (
                                                        <ArrowDownLeft
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <ArrowUpRight
                                                            size={16}
                                                        />
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {tx.description}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {tx.mentor?.name ||
                                                tx.user?.name ||
                                                'Unknown'}
                                            <span className="block text-xs text-slate-400">
                                                {tx.mentor?.email ||
                                                    tx.user?.email}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(
                                                tx.date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-right font-bold ${tx.type === 'earning' ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {tx.type === 'earning' ? '+' : '-'}{' '}
                                            ₹{tx.amount}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-bold uppercase ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-8 text-center text-gray-400"
                                    >
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <span className="text-sm text-gray-500">
                            Page {page} of {totalPages} ({totalTransactions}{' '}
                            transactions)
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFinancialsPage;
