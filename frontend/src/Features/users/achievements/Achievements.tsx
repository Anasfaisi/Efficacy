import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../home/layouts/Navbar';
import Sidebar from '../home/layouts/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import BadgePreview from '@/Features/admin/gamification/components/BadgePreview';
import { Clock, Lock, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { badgeApi } from '@/Services/Gamification/badge.api';
import type { Badge, UserBadge } from '@/types/gamification';
import { userBadgeApi } from '@/Services/Gamification/userBadge.api';

const Achievements = () => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [userBadge, setUserBadges] = useState<UserBadge[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBadges(1);
    }, []);

    const fetchBadges = useCallback(
        async (page: number) => {
            setIsLoading(true);
            try {
                const result = await userBadgeApi.getUserBadges();
                console.log(result,"result from achievements .tsx")
                const allBadges = await badgeApi.getAllBadges(page, 20);
                setBadges(allBadges.badges || []);
                setUserBadges(result.badges);
            } catch (error) {
                console.error('Failed to fetch badges', error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const unlockedIds = new Set(userBadge.map((ub) => ub.badgeId));
    
    const unlocked: typeof badges = [];
    const locked: typeof badges = [];

    badges.forEach((badge) => {
        const enhancedBadge = { ...badge, isUnlocked: unlockedIds.has(badge.id) };
        enhancedBadge.isUnlocked ? unlocked.push(enhancedBadge) : locked.push(enhancedBadge);
    });

    const sortedBadges = [...unlocked, ...locked];

    return (
        <div className="flex bg-slate-50 h-screen overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar />

                <main className="flex-1 overflow-y-auto bg-[#FAFAFA] relative">
                    {/* Background decorations */}
                    <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                        {/* Header Area */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-3">
                                    <Sparkles size={14} />
                                    Rewards & Milestones
                                </div>
                                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                                    Your Achievements
                                </h1>
                                <p className="mt-3 text-slate-500 max-w-2xl text-lg">
                                    Discover all the badges you can earn.
                                    Complete tasks, build streaks, and stay
                                    focused to unlock these exclusive rewards.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex flex-col items-center justify-center pr-4 border-r border-slate-100">
                                    <span className="text-2xl font-black text-slate-800">
                                        {sortedBadges.length}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        Available
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center pl-2">
                                    <Trophy
                                        size={24}
                                        className="text-amber-500 mb-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Badges Grid */}
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : sortedBadges.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                                <Trophy
                                    size={48}
                                    className="mx-auto text-slate-300 mb-4"
                                />
                                <h3 className="text-lg font-bold text-slate-700">
                                    No Badges Found
                                </h3>
                                <p className="text-slate-500 mt-2">
                                    Check back later for new challenges!
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.05 },
                                    },
                                }}
                            >
                                <AnimatePresence>
                                    {sortedBadges.map((badge) => (
                                        <motion.div
                                            key={
                                                badge.id ||
                                                Math.random().toString()
                                            }
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 },
                                            }}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            className={`group relative bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full overflow-hidden ${
                                                !badge.isUnlocked
                                                    ? 'opacity-60 grayscale-[50%]'
                                                    : ''
                                            }`}
                                        >
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                            {/* Content */}
                                            <div className="relative z-10 flex flex-col h-full">
                                                {/* Header: Icon & Template */}
                                                <div className="flex justify-between items-start mb-5">
                                                    <div className="transform transition-transform duration-300 group-hover:scale-110 origin-top-left drop-shadow-md">
                                                        <BadgePreview
                                                            badge={badge as any}
                                                            size="lg"
                                                        />
                                                    </div>

                                                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                                                        {badge.template?.replace(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Body: Name & Story */}
                                                <div className="flex flex-col flex-grow">
                                                    <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                                        {badge.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                                                        {badge.story ||
                                                            'A special badge awaiting a true champion.'}
                                                    </p>
                                                </div>

                                                {/* Footer: Threshold */}
                                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-1.5 rounded-md ${badge.isUnlocked ? 'bg-green-50' : 'bg-slate-50'}`}>
                                                            {badge.isUnlocked ? (
                                                                <ShieldCheck
                                                                    size={14}
                                                                    className="text-green-500"
                                                                />
                                                            ) : (
                                                                <Lock
                                                                    size={14}
                                                                    className="text-slate-400"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${badge.isUnlocked ? 'text-green-600' : 'text-slate-400'}`}>
                                                                {badge.isUnlocked ? 'Unlocked' : 'Requires '}
                                                            </span>
                                                            <span className="text-sm font-bold text-slate-700">
                                                                {
                                                                    badge.threshold
                                                                }{' '}
                                                                {badge.template?.includes(
                                                                    'TIME'
                                                                )
                                                                    ? 'Mins'
                                                                    : `${badge.template}`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {badge.design?.rarity && (
                                                        <span
                                                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md
                                                            ${
                                                                badge.design
                                                                    .rarity ===
                                                                'LEGENDARY'
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : badge
                                                                            .design
                                                                            .rarity ===
                                                                        'EPIC'
                                                                      ? 'bg-purple-100 text-purple-700'
                                                                      : badge
                                                                              .design
                                                                              .rarity ===
                                                                          'RARE'
                                                                        ? 'bg-blue-100 text-blue-700'
                                                                        : badge
                                                                                .design
                                                                                .rarity ===
                                                                            'UNCOMMON'
                                                                          ? 'bg-green-100 text-green-700'
                                                                          : 'bg-slate-100 text-slate-600'
                                                            }
                                                        `}
                                                        >
                                                            {
                                                                badge.design
                                                                    .rarity
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Achievements;
