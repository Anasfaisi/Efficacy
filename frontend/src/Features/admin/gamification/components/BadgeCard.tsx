import React, { useState } from 'react';
import type { Badge } from '@/types/gamification';
import BadgePreview from './BadgePreview';
import { Edit2, Trash2, Lock, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface BadgeCardProps {
    badge: Badge;
    onEdit: (badge: Badge) => void;
    onToggleStatus: (badgeId: string, currentStatus: boolean) => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
    badge,
    onEdit,
    onToggleStatus,
}) => {
    const [isActive, setIsActive] = useState(badge.isActive);

    const handleToggle = async () => {
        if (!badge.id) return;
        const newStatus = !isActive;
        setIsActive(newStatus);
        try {
            await onToggleStatus(badge.id, isActive);
        } catch {
            setIsActive(isActive);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="group relative bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-5"
        >
            {/* 1. Header Section: Name & Actions */}
            <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold text-slate-800 leading-tight truncate">
                    {badge.name}
                </h3>
                
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => onEdit(badge)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                        <Edit2 size={18} />
                    </button>
                    
                    <button
                        onClick={handleToggle}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ${
                            isActive ? 'bg-green-500' : 'bg-slate-200'
                        }`}
                        aria-checked={isActive}
                        role="switch"
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                                isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* 2. Content Section: Icon & Metadata */}
            <div className="flex items-center gap-5">
                <div className="shrink-0 scale-110">
                    <BadgePreview badge={badge} size="lg" />
                </div>

                <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-80">
                        Metric Template
                    </span>
                    <p className="text-sm font-bold text-slate-700 truncate">
                        {badge.template}
                    </p>
                    
                    <div className="mt-1">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                            isActive 
                                ? 'bg-green-50 text-green-600 border-green-100' 
                                : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Footer Section: Threshold & Time */}
            <div className="mt-2 pt-5 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
                    <Lock size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        Unlocks at <span className="font-bold text-slate-800">{badge.threshold}</span>
                    </span>
                </div>
                
                {badge.updatedAt && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                        <Clock size={10} />
                        <span>{new Date(badge.updatedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default BadgeCard;