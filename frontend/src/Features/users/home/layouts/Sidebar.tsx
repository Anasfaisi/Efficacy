import {
    LayoutDashboard,
    CheckSquare,
    StickyNote,
    Calendar,
    Timer,
    Users,
    Music,
    User,
    Trophy,
    Layout,
    ChevronRight,
    Wallet,
} from 'lucide-react';
import SidebarButton from '../components/SidebarButton';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const navItems = [
        {
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            to: '/home',
            color: '#7F00FF',
        },
        {
            icon: <CheckSquare size={20} />,
            label: 'Tasks',
            to: '/tasks',
            color: '#FF5722',
        },
        {
            icon: <StickyNote size={20} />,
            label: 'Notes',
            to: '/notes',
            color: '#7F00FF',
        },
        {
            icon: <Calendar size={20} />,
            label: 'Planner',
            to: '/planner',
            color: '#7F00FF',
        },
        {
            icon: <Timer size={20} />,
            label: 'Pomodoro Timer',
            to: '/pomodoro',
            color: '#f87171',
        },
        // {
        // //     icon: <MessageSquare size={20} />,
        // //     label: 'Chat',
        // //     to: '#',
        // //     color: '#009688',
        // // },
        {
            icon: <Users size={20} />,
            label: 'Mentor Pool',
            color: '#7F00FF',
            subItems: [
                { label: 'Find Mentors', to: '/mentors' },
                { label: 'My Mentorships', to: '/my-mentorships' },
                { label: 'Chat', to: '/chat' },
            ],
        },
        {
            icon: <Music size={20} />,
            label: 'Music',
            to: '#',
            color: '#00897B',
        },
        {
            icon: <User size={20} />,
            label: 'Profile',
            to: '/profile',
            color: '#7F00FF',
        },
        {
            icon: <Wallet size={20} />,
            label: 'Wallet',
            to: '/profile/wallet',
            color: '#7F00FF',
        },
        {
            icon: <Trophy size={20} />,
            label: 'Leaderboard',
            to: '#',
            color: '#FFC107',
        },
    ];

    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (
            location.pathname.startsWith('/mentors') ||
            location.pathname.startsWith('/mentorship') ||
            location.pathname.startsWith('/my-mentorships')
        ) {
            setExpandedItems((prev) => [...new Set([...prev, 'Mentor Room'])]);
        }
    }, [location.pathname]);

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

    return (
        <div className={`${collapsed ? 'w-24' : 'w-64'} h-screen bg-white border-r border-gray-100 flex flex-col shadow-2xl shadow-gray-200/50 relative z-20 transition-all duration-300`}>
            {/* Toggle Button */}
            <button 
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#7F00FF] shadow-sm z-50"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronRight size={14} className="rotate-180" />}
            </button>

            <div className={`px-6 py-8 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="bg-gradient-to-tr from-[#7F00FF] to-[#E100FF] p-2 rounded-xl text-white shadow-lg shadow-[#7F00FF]/30 shrink-0">
                    <Layout size={24} strokeWidth={3} />
                </div>
                {!collapsed && (
                    <div className="text-2xl font-black text-gray-900 tracking-tighter whitespace-nowrap overflow-hidden">
                        Efficacy<span className="text-[#7F00FF]">.</span>
                    </div>
                )}
            </div>

            <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                {navItems.map((item) => (
                    <div key={item.label}>
                        <SidebarButton
                            icon={item.icon}
                            label={item.label}
                            to={item.subItems ? undefined : item.to}
                            collapsed={collapsed}
                            onClick={
                                item.subItems
                                    ? () => toggleExpand(item.label)
                                    : undefined
                            }
                            active={
                                !item.subItems && location.pathname === item.to
                            }
                        />
                        {item.subItems &&
                            !collapsed &&
                            expandedItems.includes(item.label) && (
                                <div className="ml-12 flex flex-col gap-1 mt-1 border-l-2 border-gray-100 pl-4">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.label}
                                            to={subItem.to}
                                            className={`block py-2 text-sm font-medium transition-colors ${
                                                location.pathname === subItem.to
                                                    ? 'text-[#7F00FF]'
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
            </nav>

            {!collapsed && (
                <div className="p-6 border-t border-gray-50">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                            7
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Daily Streak
                            </p>
                            <p className="text-xs font-bold text-gray-900">
                                Keep it up!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
