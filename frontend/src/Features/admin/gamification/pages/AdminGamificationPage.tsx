import { useState, useEffect } from 'react';
import { adminGamificationApi } from '@/Services/adminGamification.api';
import type {
    IBadge,
    IGamificationConstants,
} from '@/Services/adminGamification.api';
import BadgePreview from '../components/BadgePreview';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminBadgesPage() {
    const [badges, setBadges] = useState<IBadge[]>([]);
    const [constants, setConstants] = useState<IGamificationConstants | null>(
        null
    );
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState<Partial<IBadge> | null>(
        null
    );

    // Initial state matching standard IBadge schema
    const initialFormState: Partial<IBadge> = {
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
        useState<Partial<IBadge>>(initialFormState);

    useEffect(() => {
        console.log('AdminGamificationPage loaded, fetching data...');
        loadData();
    }, []);

    const loadData = async () => {
        console.log('Executing gamification api calls...');
        try {
            const [bRes, cRes] = await Promise.all([
                adminGamificationApi.getAllBadges().catch((e) => {
                    console.error('Badges error:', e);
                    return { success: false, badges: [] };
                }),
                adminGamificationApi.getConstants().catch((e) => {
                    console.error('Constants error:', e);
                    return {
                        success: false,
                        templates: [],
                        triggerEvents: [],
                        rarities: [],
                    };
                }),
            ]);
            console.log('API Responses:', { bRes, cRes });

            if (bRes.success) setBadges(bRes.badges);
            // Default to empty arrays if undefined so constants is not null, ensuring the UI opens later
            setConstants({
                templates: cRes.templates || [
                    'TASK_COUNT',
                    'TASK_STREAK',
                    'POMODORO_COUNT',
                ],
                triggerEvents: cRes.triggerEvents || [
                    'TASK_COMPLETED',
                    'STREAK_UPDATED',
                ],
                rarities: cRes.rarities || ['COMMON', 'RARE', 'EPIC'],
            });
        } catch (error) {
            console.error('Critical loading error', error);
            toast.error('Failed to load Gamification system data');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBadge?._id) {
                await adminGamificationApi.updateBadge(
                    editingBadge._id,
                    formState
                );
                toast.success('Badge successfully updated');
            } else {
                await adminGamificationApi.createBadge(formState);
                toast.success('New Badge unlocked directly into the DB!');
            }
            setIsFormOpen(false);
            setEditingBadge(null);
            setFormState(initialFormState);
            loadData();
        } catch {
            toast.error('Failed to save Badge');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this badge permanently?')) return;
        try {
            await adminGamificationApi.deleteBadge(id);
            toast.success('Badge shattered into pixels');
            loadData();
        } catch {
            toast.error('Delete failed');
        }
    };

    const openEdit = (badge: IBadge) => {
        setEditingBadge(badge);
        setFormState(badge);
        setIsFormOpen(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0c2d48]">
                        Gamification Engine
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Design Badges, Set Thresholds, Let the Backend Evaluate
                    </p>
                </div>
                <button
                    onClick={() => {
                        console.log(
                            "User clicked 'Build New Badge', isFormOpen will become true",
                            constants
                        );
                        setFormState(initialFormState);
                        setEditingBadge(null);
                        setIsFormOpen(true);
                    }}
                    className="flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all items-center gap-2"
                >
                    <Plus size={20} /> Build New Badge
                </button>
            </div>

            {/* List existing badges in a dynamic premium grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {badges.map((badge) => (
                    <div
                        key={badge._id}
                        className="relative group rounded-xl p-4 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center"
                    >
                        <BadgePreview badge={badge} size="lg" />

                        <div className="mt-4 text-center w-full">
                            <p className="text-xs text-blue-500 font-bold mb-1">
                                {badge.template}
                            </p>
                            <p className="text-[10px] text-gray-400 capitalize bg-gray-50 rounded px-2 py-0.5 inline-block truncate max-w-full">
                                Unlocks at {badge.threshold}
                            </p>
                        </div>

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                            <button
                                onClick={() => openEdit(badge)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() =>
                                    badge._id && handleDelete(badge._id)
                                }
                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {badges.length === 0 && (
                <div className="text-center py-24 text-gray-400 border border-dashed rounded-xl border-gray-300">
                    No Badges forged yet. Click "Build New Badge" to seed your
                    gamification DB.
                </div>
            )}

            {/* Admin Badge Creator Modal Form */}
            {isFormOpen && constants && (
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

                            <h3 className="uppercase tracking-widest text-[#0c2d48] font-bold text-xs mb-8 z-10">
                                Live Preview
                            </h3>
                            {/* Renders exactly what the user sees */}
                            <BadgePreview badge={formState} size="lg" />

                            <p className="mt-8 text-center text-sm font-medium text-gray-700 max-w-[200px] z-10 italic">
                                "
                                {formState.story || 'A glorious description...'}
                                "
                            </p>
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
                                        {constants.templates.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
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
                                    {constants.triggerEvents.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
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
                                                        .value as IBadge['design']['rarity'],
                                                },
                                            })
                                        }
                                    >
                                        {constants.rarities.map((r) => (
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
