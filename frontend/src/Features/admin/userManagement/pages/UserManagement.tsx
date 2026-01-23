import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/Services/admin.api';
import type { User } from '@/types/auth';
import {
    Search,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Calendar,
    User as UserIcon,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers(
                currentPage,
                limit,
                debouncedSearch
            );
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleStatus = async (
        userId: string,
        currentStatus: boolean
    ) => {
        try {
            setActionLoading(userId);
            await adminService.updateUserStatus(userId, !currentStatus);
            toast.success(
                `User ${currentStatus ? 'blocked' : 'unblocked'} successfully`
            );
            // Update local state
            setUsers(
                users.map((user) =>
                    user.id === userId
                        ? { ...user, isActive: !currentStatus }
                        : user
                )
            );
        } catch (error) {
            console.error('Failed to update user status:', error);
            toast.error('Failed to update user status');
        } finally {
            setActionLoading(null);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-12 h-12 text-[#7F00FF] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        User Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage platform users and their access status
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF] transition-all w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Contacts
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Joined Date
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#7F00FF]/5 flex items-center justify-center text-[#7F00FF] font-bold border border-[#7F00FF]/10 overflow-hidden">
                                                    {user.profilePic ? (
                                                        <img
                                                            src={
                                                                user.profilePic
                                                            }
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserIcon size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 capitalize">
                                                        {user.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail
                                                        size={14}
                                                        className="text-gray-400"
                                                    />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                                {user.createdAt
                                                    ? new Date(
                                                          user.createdAt
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.isActive
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                        : 'bg-red-50 text-red-700 border border-red-100'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                />
                                                {user.isActive
                                                    ? 'Active'
                                                    : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(
                                                        user.id,
                                                        user.isActive
                                                    )
                                                }
                                                disabled={
                                                    actionLoading === user.id
                                                }
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                    user.isActive
                                                        ? 'text-red-600 hover:bg-red-50 focus:ring-red-500/20'
                                                        : 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500/20'
                                                } focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {actionLoading === user.id ? (
                                                    <Loader2
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                ) : user.isActive ? (
                                                    <ShieldAlert size={16} />
                                                ) : (
                                                    <ShieldCheck size={16} />
                                                )}
                                                {user.isActive
                                                    ? 'Block User'
                                                    : 'Unblock User'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls - Inspired by MentorListingPage */}
                {!loading && users.length > 0 && totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500">
                            Showing{' '}
                            <span className="font-medium text-gray-900">
                                {users.length}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-gray-900">
                                {totalCount}
                            </span>{' '}
                            users
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft
                                    size={20}
                                    className="text-gray-600"
                                />
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() =>
                                            handlePageChange(pageNum)
                                        }
                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-[#7F00FF] text-white shadow-sm shadow-[#7F00FF]/25'
                                                : 'text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight
                                    size={20}
                                    className="text-gray-600"
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
