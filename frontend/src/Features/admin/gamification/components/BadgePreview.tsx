import type { IBadge } from '@/Services/Gamification/adminGamification.api';
import * as Icons from 'lucide-react';

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
        sm: { container: 'w-12 h-12', icon: 18 },
        md: { container: 'w-16 h-16', icon: 24 },
        lg: { container: 'w-24 h-24', icon: 36 },
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
        <div
            className={`
                relative flex items-center justify-center 
                ${sizes[size].container} rounded-xl shadow-lg overflow-hidden
                border border-white/10 ${colors.bg}
                ring-1 ring-inset ${colors.ring}/30
            `}
            style={{
                background: `linear-gradient(135deg, ${colors.hex} 0%, ${badge.design?.bgColor || '#1f2937'} 100%)`,
            }}
        >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {/* The Badge Icon */}
            <div
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm"
                style={{ color: badge.design?.primaryColor || '#ffffff' }}
            >
                <LucideIcon size={sizes[size].icon} strokeWidth={1.5} />
            </div>

            {/* Small rarity indicator star or dot */}
            {rarity === 'LEGENDARY' && (
                <div className="absolute top-1 right-1">
                    <Icons.Sparkles size={10} className="text-yellow-300" />
                </div>
            )}
        </div>
    );
}
