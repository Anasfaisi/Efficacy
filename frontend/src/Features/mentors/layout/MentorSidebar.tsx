import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    UserCircle,
    BookOpen,
    LogOut,
    Wallet,
    MessageSquare,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';

const MentorSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (label: string) => {
        if (collapsed) {
             setCollapsed(false);
             setExpandedItems([label]);
             return;
        }

        if (expandedItems.includes(label)) {
            setExpandedItems(expandedItems.filter((l) => l !== label));
        } else {
            setExpandedItems([...expandedItems, label]);
        }
    };

    useEffect(() => {
        if (
            location.pathname.startsWith('/mentor/sessions') ||
            location.pathname.startsWith('/mentor/booking-requests')
        ) {
            setExpandedItems((prev) => [...new Set([...prev, 'Mentorships'])]);
        }
    }, [location.pathname]);

    const navItems = [
        {
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            to: '/mentor/dashboard',
        },
        {
            icon: <Users size={20} />,
            label: 'Mentorship Requests',
            to: '/mentor/requests',
        },
        {
            icon: <Calendar size={20} />,
            label: 'Mentorships',
            // to: '/mentor/sessions', // Removed direct link
            subItems: [
                { label: 'Active Mentees', to: '/mentor/sessions' },
                { label: 'Booking Requests', to: '/mentor/booking-requests' },
            ]
        },
        {
            icon: <MessageSquare size={20} />,
            label: 'Chat',
            to: '/mentor/chat',
        },
        {
            icon: <Wallet size={20} />,
            label: 'Wallet',
            to: '/mentor/wallet',
        },
        {
            icon: <UserCircle size={20} />,
            label: 'Profile',
            to: '/mentor/profile',
        },
        {
            icon: <BookOpen size={20} />,
            label: 'Guidelines',
            to: '/mentor/guidelines',
        },
    ];

    const isActive = (path?: string) => path ? location.pathname === path : false;

    return (
        <aside className={`sticky top-0 h-screen ${collapsed ? 'w-24' : 'w-72'} bg-white border-r border-gray-200 z-20 hidden lg:flex flex-col transition-all duration-300 shrink-0`}>
             {/* Toggle Button */}
             <button 
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-indigo-600 shadow-sm z-50"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={`p-8 pb-4 ${collapsed ? 'px-4' : ''}`}>
                <div className={`flex items-center gap-3 mb-8 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 shrink-0">
                        E
                    </div>
                    {!collapsed && (
                        <div className="text-2xl font-bold text-gray-900 tracking-tight overflow-hidden whitespace-nowrap">
                            Efficacy
                        </div>
                    )}
                </div>

                <div className="space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            <NavItem
                                to={item.to}
                                icon={item.icon}
                                label={item.label}
                                active={isActive(item.to)}
                                collapsed={collapsed}
                                onClick={
                                    item.subItems
                                        ? () => toggleExpand(item.label)
                                        : undefined
                                }
                                hasSubItems={!!item.subItems}
                            />
                            {item.subItems && !collapsed && expandedItems.includes(item.label) && (
                                <div className="ml-12 flex flex-col gap-1 mt-1 border-l-2 border-gray-100 pl-4 animate-in slide-in-from-top-2 duration-200">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.label}
                                            to={subItem.to}
                                            className={`block py-2 text-sm font-medium transition-colors ${
                                                location.pathname === subItem.to
                                                    ? 'text-indigo-600'
                                                    : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            {subItem.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-gray-100">
                <button
                    onClick={() => navigate('/mentor/logout')}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? "Logout" : ""}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

const NavItem = ({
    to,
    icon,
    label,
    active,
    collapsed,
    onClick,
    hasSubItems
}: {
    to?: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    collapsed?: boolean;
    onClick?: () => void;
    hasSubItems?: boolean;
}) => {
    const content = (
        <>
            {icon}
            {!collapsed && <span className="flex-1">{label}</span>}
            {!collapsed && hasSubItems && (
                <ChevronRight size={14} className="text-gray-400" />
            )}
        </>
    );

    const className = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium cursor-pointer w-full text-left ${
        active
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    } ${collapsed ? 'justify-center' : ''}`;

    if (onClick) {
        return (
            <button onClick={onClick} className={className} title={collapsed ? label : ""}>
                {content}
            </button>
        );
    }

    return (
        <Link to={to!} className={className} title={collapsed ? label : ""}>
            {content}
        </Link>
    );
};

export default MentorSidebar;
