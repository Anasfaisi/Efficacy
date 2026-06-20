import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminService } from '@/Services/admin.api';
import AddPlanModal, { type PlanData } from './AddPlanModal';
import type { Plan } from '../types';
import { toast } from 'sonner';

export default function PlanTable() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'active' | 'inactive'
    >('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);

    const openEditModal = (plan: Plan) => {
        setIsEditMode(true);
        setPlanToEdit(plan);
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setPlanToEdit(null);
        setIsEditMode(false);
    };

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset to page 1 on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const limit = 5;
            const response = await adminService.getPlans(
                debouncedSearch,
                statusFilter,
                currentPage,
                limit
            );

            const fetchedPlans = response.data || [];
            const total = response.total || 0;

            setPlans(fetchedPlans);
            setTotalItems(total);
            setTotalPages(Math.max(1, Math.ceil(total / limit)));
        } catch (error) {
            console.error('Failed to fetch plans', error);
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, statusFilter, currentPage]);

    useEffect(() => {
        fetchPlans();
    }, [debouncedSearch, statusFilter, currentPage, fetchPlans]);

    const handleAddPlan = async (newPlanData: PlanData) => {
        try {
            if (isEditMode && planToEdit) {
                const targetId =
                    planToEdit._id || (planToEdit as { id?: string }).id;
                await adminService.updatePlan(targetId, newPlanData);
                toast.success('Plan updated successfully!');
            } else {
                await adminService.createPlan(newPlanData);
                toast.success('Plan created successfully!');
            }
            closeAddModal();
            fetchPlans(); // Re-fetch to get updated data
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ||
                'Failed to process plan request.';
            toast.error(errorMessage);
        }
    };

    const handleToggleStatus = async (
        planId: string,
        currentStatus: boolean
    ) => {
        try {
            await adminService.deletePlan(planId, !currentStatus);
            toast.success(
                `Plan marked as ${!currentStatus ? 'Active' : 'Inactive'}`
            );
            fetchPlans();
        } catch {
            toast.error('Failed to change plan status');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Subscription Plans
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage user subscription tiers, features, and pricing
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                        {(['all', 'active', 'inactive'] as const).map(
                            (status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={cn(
                                        'px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all',
                                        statusFilter === status
                                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    )}
                                >
                                    {status === 'all' ? 'All' : status}
                                </button>
                            )
                        )}
                    </div>

                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Name, feature or price..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-64 shadow-sm text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setIsEditMode(false);
                            setPlanToEdit(null);
                            setIsAddModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">New Plan</span>
                    </button>
                </div>
            </div>

            {/* Plans Table/List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                                    Plan Info
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                                    Pricing & Cycle
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs hidden md:table-cell">
                                    Features
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs">
                                    Status
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-xs text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            Loading plans...
                                        </div>
                                    </td>
                                </tr>
                            ) : plans.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                <Package
                                                    className="text-gray-400"
                                                    size={24}
                                                />
                                            </div>
                                            <h3 className="text-gray-900 font-medium mb-1">
                                                No plans found
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Try adjusting your filters or
                                                search terms.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                plans.map((plan) => (
                                    <tr
                                        key={plan._id}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        {/* Plan Info */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-900 text-base">
                                                    {plan.name}
                                                </span>
                                                {plan.mentorType &&
                                                    plan.mentorType !==
                                                        'None' && (
                                                        <span className="inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                            {plan.mentorType}{' '}
                                                            Type
                                                        </span>
                                                    )}
                                            </div>
                                        </td>

                                        {/* Pricing */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">
                                                    ₹{plan.price.toFixed(2)}
                                                </span>
                                                <span className="text-gray-500 text-xs">
                                                    per {plan.billingCycleDays}{' '}
                                                    days
                                                </span>
                                            </div>
                                        </td>

                                        {/* Features List */}
                                        <td className="px-6 py-4 align-top hidden md:table-cell">
                                            <div className="flex flex-col gap-1 max-w-xs">
                                                <div className="text-gray-700 mb-1">
                                                    <span className="font-medium">
                                                        {plan.features.length}
                                                    </span>{' '}
                                                    included features
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {plan.features
                                                        .slice(0, 2)
                                                        .map((feat, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-[11px] text-gray-600 truncate max-w-[120px]"
                                                            >
                                                                {feat}
                                                            </span>
                                                        ))}
                                                    {plan.features.length >
                                                        2 && (
                                                        <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-[11px] text-gray-500">
                                                            +
                                                            {plan.features
                                                                .length -
                                                                2}{' '}
                                                            more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 align-top">
                                            <div
                                                className={cn(
                                                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                                                    plan.isActive
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-gray-100 text-gray-700 border-gray-200'
                                                )}
                                            >
                                                {plan.isActive ? (
                                                    <CheckCircle2 size={14} />
                                                ) : (
                                                    <XCircle size={14} />
                                                )}
                                                {plan.isActive
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(plan)
                                                    }
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Plan"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            plan._id,
                                                            plan.isActive
                                                        )
                                                    }
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title={
                                                        plan.isActive
                                                            ? 'Deactivate Plan'
                                                            : 'Activate Plan'
                                                    }
                                                >
                                                    {plan.isActive ? (
                                                        <Trash2 size={16} />
                                                    ) : (
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                    )}
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-gray-500 text-sm">
                        Showing{' '}
                        <span className="font-medium text-gray-900">
                            {plans.length}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium text-gray-900">
                            {totalItems}
                        </span>{' '}
                        plans
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1 || loading}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        'w-9 h-9 rounded-xl text-sm font-medium transition-all shadow-sm',
                                        currentPage === page
                                            ? 'bg-blue-600 text-white shadow-blue-500/20'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage >= totalPages || loading}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Plan Modal */}
            <AddPlanModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={handleAddPlan}
                initialData={planToEdit}
                isEditMode={isEditMode}
            />
        </div>
    );
}
