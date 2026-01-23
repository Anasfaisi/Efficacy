import React, { useState } from 'react';
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

    const isActive = (path: string) => location.pathname === path;

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

                <div className="space-y-1">
                    <NavItem
                        to="/mentor/dashboard"
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        active={isActive('/mentor/dashboard')}
                        collapsed={collapsed}
                    />
                    <NavItem
                        to="/mentor/requests"
                        icon={<Users size={20} />}
                        label="Requests"
                        active={isActive('/mentor/requests')}
                        collapsed={collapsed}
                    />
                    <NavItem
                        to="/mentor/sessions"
                        icon={<Calendar size={20} />}
                        label="Mentorships"
                        active={isActive('/mentor/sessions')}
                        collapsed={collapsed}
                    />
                    <NavItem
                        to="/mentor/chat"
                        icon={<MessageSquare size={20} />}
                        label="Chat"
                        active={isActive('/mentor/chat')}
                        collapsed={collapsed}
                    />
                    <NavItem
                        to="/mentor/wallet"
                        icon={<Wallet size={20} />}
                        label="Wallet"
                        active={isActive('/mentor/wallet')}
                        collapsed={collapsed}
                    />
                    <NavItem
                        to="/mentor/profile"
                        icon={<UserCircle size={20} />}
                        label="Profile"
                        active={isActive('/mentor/profile')}
                        collapsed={collapsed}
                    />
                    <NavItem
                        to="/mentor/guidelines"
                        icon={<BookOpen size={20} />}
                        label="Guidelines"
                        active={isActive('/mentor/guidelines')}
                        collapsed={collapsed}
                    />
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
}: {
    to: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    collapsed?: boolean;
}) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
            active
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        } ${collapsed ? 'justify-center' : ''}`}
        title={collapsed ? label : ""}
    >
        {icon}
        {!collapsed && <span>{label}</span>}
    </Link>
);

export default MentorSidebar;
