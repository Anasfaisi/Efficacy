import type { IBadge } from '@/Services/adminGamification.api';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

// Maps backend string to a reliable CSS Tailwind configuration for colors
const RarityColors = {
    COMMON: {
        bg: 'bg-zinc-800',
        hex: '#27272a',
        ring: 'ring-zinc-600',
        text: 'text-zinc-300',
    },
    UNCOMMON: {
        bg: 'bg-green-900',
        hex: '#14532d',
        ring: 'ring-green-500',
        text: 'text-green-300',
    },
    RARE: {
        bg: 'bg-blue-900',
        hex: '#1e3a8a',
        ring: 'ring-blue-500',
        text: 'text-blue-300',
    },
    EPIC: {
        bg: 'bg-purple-900',
        hex: '#581c87',
        ring: 'ring-purple-500',
        text: 'text-purple-300',
    },
    LEGENDARY: {
        bg: 'bg-amber-600',
        hex: '#d97706',
        ring: 'ring-amber-400',
        text: 'text-amber-100',
    },
};

interface BadgePreviewProps {
    badge: Partial<IBadge>;
    size?: 'sm' | 'md' | 'lg';
}

export default function BadgePreview({
    badge,
    size = 'md',
}: BadgePreviewProps) {
    const rarity = badge.design?.rarity || 'COMMON';
    const colors = RarityColors[rarity] || RarityColors.COMMON;

    const sizes = {
        sm: { container: 'w-20 h-24', icon: 20, text: 'text-[10px]' },
        md: { container: 'w-28 h-32', icon: 32, text: 'text-xs' },
        lg: { container: 'w-36 h-44', icon: 48, text: 'text-sm' },
    };

    const iconName = badge.design?.iconName || 'Trophy';

    const UnknownIcons = Icons as unknown as Record<
        string,
        React.ComponentType<{
            size?: number;
            strokeWidth?: number;
            className?: string;
        }>
    >;
    const LucideIcon = UnknownIcons[iconName] || Icons.Trophy;

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.05 }}
            className={`
                relative flex flex-col items-center justify-center 
                ${sizes[size].container} rounded-xl shadow-2xl overflow-hidden
                border border-white/10 ${colors.bg}
                ring-1 ring-inset ${colors.ring}/30
            `}
            style={{
                background: `linear-gradient(135deg, ${colors.hex} 0%, ${badge.design?.bgColor || '#1f2937'} 100%)`,
            }}
        >
            <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

            {/* The Badge Icon */}
            <div
                className="p-3 rounded-full mb-1 bg-black/30 shadow-inner backdrop-blur-sm"
                style={{ color: badge.design?.primaryColor || '#ffffff' }}
            >
                <LucideIcon size={sizes[size].icon} strokeWidth={1.5} />
            </div>

            {/* Badge Info */}
            <div className="text-center px-1 z-10 w-full truncate">
                <span
                    className={`font-bold tracking-wider ${colors.text} ${sizes[size].text}`}
                >
                    {(badge.name || 'New Badge').toUpperCase()}
                </span>
            </div>

            {/* Small rarity indicator star or dot */}
            {rarity === 'LEGENDARY' && (
                <div className="absolute top-2 right-2 flex space-x-0.5">
                    <Icons.Sparkles size={12} className="text-yellow-300" />
                </div>
            )}
        </motion.div>
    );
}
