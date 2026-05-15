import { useState, useEffect, useCallback } from 'react';
import { badgeApi } from '@/Services/Gamification/badge.api';
import { adminGamificationApi } from '@/Services/Gamification/adminGamification.api';
import BadgePreview from '../components/BadgePreview';
import BadgeCard from '../components/BadgeCard';
import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    Filter,
    Settings2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Badge } from '@/types/gamification';
import { BadgeTemplate, GamificationEvent, Rarity } from '@/types/gamification';
import { BadgeMessages } from '@/utils/Constants';

export default function AdminBadgesPage() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState<Partial<Badge> | null>(
        null
    );
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>(
        'all'
    );
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 10;

    // Initial state matching standard Badge schema
    const initialFormState: Partial<Badge> = {
        name: '',
        story: '',
        template: 'TASK_COUNT',
        threshold: 10,
        triggerEvent: 'TASK_COMPLETED',
        design: {
            iconType: 'icon',
            iconName: 'Trophy',
            primaryColor: '#ffffff',
            bgColor: '#1e3a8a',
            rarity: 'COMMON',
        },
    };

    const [formState, setFormState] =
        useState<Partial<Badge>>(initialFormState);

    const fetchBadges = useCallback(
        async (page: number) => {
            setLoading(true);
            try {
                const response = await badgeApi.getAllBadges(page, limit);
                if (response.success) {
                    setBadges(response.badges);
                    setTotalItems(response.total);
                    setTotalPages(Math.ceil(response.total / limit) || 1);
                }
            } catch (error) {
                console.error('Failed to fetch badges', error);
                toast.error('Failed to load badges');
            } finally {
                setLoading(false);
            }
        },
        [limit]
    );

    const loadInitialData = async () => {
        await fetchBadges(1);
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (currentPage > 1) {
            fetchBadges(currentPage);
        } else if (currentPage === 1 && badges.length > 0) {
            fetchBadges(1);
        }
    }, [currentPage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBadge?.id) {
                const response = await badgeApi.updateBadge(
                    editingBadge.id,
                    formState
                );
                if (response.success) {
                    setBadges((prev) =>
                        prev.map((b) =>
                            b.id === editingBadge.id ? response.badge : b
                        )
                    );
                    toast.success(BadgeMessages.BadgeUpdated);
                }
            } else {
                const response = await badgeApi.createBadge(formState);
                if (response.success) {
                    toast.success('New Badge unlocked directly into the DB!');
                    fetchBadges(1); // Still need fetch for NEW items to get pagination right
                    setCurrentPage(1);
                }
            }
            // Cleanup: Close modal and reset form
            setIsFormOpen(false);
            setEditingBadge(null);
            setFormState(initialFormState);
        } catch {
            toast.error('Failed to save Badge');
        }
    };

    const handleToggleStatus = async (
        badgeId: string,
        currentStatus: boolean
    ) => {
        try {
            const result = await badgeApi.toggleBadgeStatus(
                badgeId,
                !currentStatus
            );
            if (result.status) {
        
                setBadges((prev) =>
                    prev.map((badge) =>
                        badge.id == badgeId ? result.badge : badge
                    )
                );
                toast.success(BadgeMessages.BadgeUpdated);
            }
        } catch (error) {
            toast.error(BadgeMessages.BadgeNotUpdated);
        }
    };

    const openEdit = (badge: Badge) => {
        setEditingBadge(badge);
        setFormState(badge);
        setIsFormOpen(true);
    };
    const activeBadges = badges.filter((b) => b.isActive);
    const inactiveBadges = badges.filter((b) => !b.isActive);

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-10 min-h-screen bg-[#f8fafc] pb-24">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Badge Engine
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Design Badges, Set Thresholds, Let the Backend Evaluate
                    </p>
                </div>
                <button
                    onClick={() => {
                        setFormState(initialFormState);
                        setEditingBadge(null);
                        setIsFormOpen(true);
                    }}
                    className="flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-500/25 transition-all items-center gap-2 group"
                >
                    <Plus
                        size={22}
                        className="group-hover:rotate-90 transition-transform duration-300"
                    />
                    Build New Badge
                </button>
            </div>

            {/* Premium Toolbar */}
            <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
                <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
                    {[
                        { id: 'all', label: 'All Badges', count: totalItems },
                        {
                            id: 'active',
                            label: 'Active',
                            count: activeBadges.length,
                        },
                        {
                            id: 'inactive',
                            label: 'Inactive',
                            count: inactiveBadges.length,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                activeTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-md shadow-blue-500/5'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {tab.label}
                            <span
                                className={`px-2 py-0.5 rounded-lg text-[10px] ${
                                    activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-slate-200 text-slate-500'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex-grow max-w-sm ml-auto relative group">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search badges..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-100 transition-all">
                    <Settings2 size={20} />
                </button>
            </div>

            {/* List existing badges in a dynamic premium grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold tracking-widest text-xs uppercase animate-pulse">
                        Forging Engine View...
                    </p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Active Badges Section */}
                    {(activeTab === 'all' || activeTab === 'active') &&
                        activeBadges.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">
                                        Active Badges
                                    </h2>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {activeBadges.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                    {activeBadges.map((badge) => (
                                        <BadgeCard
                                            key={badge.id}
                                            badge={badge}
                                            onEdit={openEdit}
                                            onToggleStatus={handleToggleStatus}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    {/* Inactive Badges Section */}
                    {(activeTab === 'all' || activeTab === 'inactive') &&
                        inactiveBadges.length > 0 && (
                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    <h2 className="text-lg font-black text-slate-500 uppercase tracking-wider">
                                        Inactive Badges
                                    </h2>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {inactiveBadges.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 opacity-75">
                                    {inactiveBadges.map((badge) => (
                                        <BadgeCard
                                            key={badge.id}
                                            badge={badge}
                                            onEdit={openEdit}
                                            onToggleStatus={handleToggleStatus}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    {badges.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                            <span className="text-6xl mb-6">🛡️</span>
                            <h3 className="text-xl font-bold text-slate-800">
                                No Badges Forged Yet
                            </h3>
                            <p className="text-slate-400 mt-2">
                                Start by building a new badge to motivate your
                                users.
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalItems > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-sm text-gray-500">
                                Showing{' '}
                                <span className="font-bold text-gray-800">
                                    {(currentPage - 1) * limit + 1}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-gray-800">
                                    {Math.min(currentPage * limit, totalItems)}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-gray-800">
                                    {totalItems}
                                </span>{' '}
                                badges
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 1 || loading}
                                    className="p-2 border border-gray-200 rounded-xl text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={
                                        currentPage >= totalPages || loading
                                    }
                                    className="p-2 border border-gray-200 rounded-xl text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Admin Badge Creator Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex shadow-2xl"
                    >
                        {/* Live Preview Side (Left) */}
                        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Ambient background matching badge rarity */}
                            <div
                                className="absolute inset-0 opacity-10 pointer-events-none blur-3xl"
                                style={{
                                    backgroundColor:
                                        formState.design?.bgColor || '#000',
                                }}
                            />

                            <h3 className="uppercase tracking-widest text-[#0c2d48] font-black text-xs mb-8 z-10 opacity-70">
                                Icon Preview
                            </h3>
                            {/* Renders exactly what the user sees */}
                            <BadgePreview badge={formState} size="lg" />

                            <div className="mt-8 text-center z-10">
                                <h4 className="text-xl font-black text-slate-800">
                                    {formState.name || 'Your Badge Name'}
                                </h4>
                                <p className="mt-2 text-sm font-medium text-slate-500 italic max-w-[200px]">
                                    "
                                    {formState.story ||
                                        'A glorious description...'}
                                    "
                                </p>
                            </div>
                        </div>

                        {/* Form Contols (Right) */}
                        <div className="w-2/3 p-8 space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editingBadge
                                        ? 'Refine Badge Config'
                                        : 'Forge Badge Design'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="text-black hover:text-red-500 font-bold p-2"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500">
                                        Badge Display Name
                                    </label>
                                    <input
                                        required
                                        className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formState.name}
                                        onChange={(e) =>
                                            setFormState({
                                                ...formState,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="E.g., 7-Day Sentinel"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500">
                                        Backend Metric Template
                                    </label>
                                    <select
                                        required
                                        className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500"
                                        value={formState.template}
                                        onChange={(e) =>
                                            setFormState({
                                                ...formState,
                                                template: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="" disabled>
                                            Select Internal Template
                                        </option>
                                        {Object.values(BadgeTemplate).map(
                                            (t) => (
                                                <option key={t} value={t}>
                                                    {t}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">
                                    Milestone Threshold Value
                                </label>
                                <input
                                    type="number"
                                    required
                                    className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500"
                                    value={formState.threshold}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            threshold: Number(e.target.value),
                                        })
                                    }
                                />
                                <p className="text-[10px] text-gray-400">
                                    If TASK_STREAK selected, Badge unlocks when
                                    "Metric &gt;= {formState.threshold || 'N'}"
                                    natively.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">
                                    Database Trigger Event Listener
                                </label>
                                <select
                                    required
                                    className="w-full border-gray-300 rounded-lg p-3 border bg-gray-50 text-gray-600 focus:ring-2 focus:ring-blue-500"
                                    value={formState.triggerEvent}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            triggerEvent: e.target.value,
                                        })
                                    }
                                >
                                    <option value="" disabled>
                                        Select Socket Emit Event
                                    </option>
                                    {Object.values(GamificationEvent).map(
                                        (t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Appearance Block */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid grid-cols-2 gap-4 mt-6">
                                <div className="col-span-2 flex items-center gap-2 mb-2">
                                    <div className="h-4 w-1 bg-blue-500 rounded-r-md"></div>
                                    <h4 className="font-semibold text-sm text-gray-700">
                                        Aesthetics & Glassmorphism
                                    </h4>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500">
                                        Lucide Icon Name ('Zap', 'Star',
                                        'Flame')
                                    </label>
                                    <input
                                        className="w-full border-gray-300 rounded-lg p-2.5 border mt-1"
                                        value={formState.design?.iconName || ''}
                                        onChange={(e) =>
                                            setFormState({
                                                ...formState,
                                                design: {
                                                    ...formState.design!,
                                                    iconName: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500">
                                        Rarity Classification
                                    </label>
                                    <select
                                        className="w-full border-gray-300 rounded-lg p-2.5 border mt-1"
                                        value={
                                            formState.design?.rarity || 'COMMON'
                                        }
                                        onChange={(e) =>
                                            setFormState({
                                                ...formState,
                                                design: {
                                                    ...formState.design!,
                                                    rarity: e.target
                                                        .value as Badge['design']['rarity'],
                                                },
                                            })
                                        }
                                    >
                                        {Object.values(Rarity).map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-4 col-span-2 pt-2 border-t border-gray-200">
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">
                                            Inner Icon Color
                                        </label>
                                        <input
                                            type="color"
                                            className="w-full h-10 p-1 mt-1 rounded cursor-pointer border-none bg-transparent"
                                            value={
                                                formState.design
                                                    ?.primaryColor || '#ffffff'
                                            }
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    design: {
                                                        ...formState.design!,
                                                        primaryColor:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">
                                            Glass Gradient End
                                        </label>
                                        <input
                                            type="color"
                                            className="w-full h-10 p-1 mt-1 rounded cursor-pointer border-none bg-transparent"
                                            value={
                                                formState.design?.bgColor ||
                                                '#000000'
                                            }
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    design: {
                                                        ...formState.design!,
                                                        bgColor: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">
                                    Lore/Story (Visible to Users)
                                </label>
                                <textarea
                                    className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 max-h-24 min-h-[80px]"
                                    value={formState.story}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            story: e.target.value,
                                        })
                                    }
                                    placeholder="The unyielding spirit of seven consecutive days..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#0c2d48] hover:bg-black text-white py-3 rounded-xl font-bold tracking-wide transition-all shadow-lg"
                            >
                                {editingBadge
                                    ? 'Deploy Changes to Badges Engine'
                                    : 'Mint Gamification Badge to DB'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
