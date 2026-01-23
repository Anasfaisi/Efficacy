import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarButtonProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    to?: string;
    collapsed?: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
    icon,
    label,
    active,
    onClick,
    to,
    collapsed
}) => {
    const baseClass = `
    flex items-center ${collapsed ? 'justify-center px-2' : 'gap-4 px-5'} py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm
    ${
        active
            ? 'bg-[#7F00FF] text-white shadow-lg shadow-[#7F00FF]/30 translate-x-1'
            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
    }
  `;

    const content = (
        <>
            <span
                className={`${active ? 'text-white' : 'text-[#7F00FF] group-hover:scale-110 transition-transform'}`}
            >
                {icon}
            </span>
            {!collapsed && <span className="tracking-tight">{label}</span>}
            {!collapsed && active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={`${baseClass} group`}>
                {content}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`${baseClass} group w-full ${!to && !onClick ? 'cursor-default' : 'cursor-pointer'}`}
        >
            {content}
        </button>
    );
};

export default SidebarButton;
