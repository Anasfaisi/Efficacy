import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
    const location = useLocation();
    const navItems = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
            to: '/admin/mentors/applications',
            label: 'Mentor Applications',
            icon: FileText,
        },
        {
            to: '/admin/mentorManagement',
            label: 'Mentor Management',
            icon: Users,
        },
        {
            to: '/admin/userManagement',
            label: 'User Management',
            icon: Users,
        },
    ];

    return (
        <aside className="h-screen w-64 bg-[#0c2d48] text-gray-300 flex flex-col sticky top-0 border-r border-white/10 shadow-xl">
            <div className="p-6 flex items-center gap-3 border-b border-white/10 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                    E
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                    Efficacy Admin
                </span>
            </div>

            <nav className="flex-1 flex flex-col px-3 py-4 gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => {
                            const isItemActive =
                                isActive ||
                                (item.to === '/admin/mentors/applications' &&
                                    location.pathname.includes(
                                        '/admin/mentors/review',
                                    ));
                            return cn(
                                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group',
                                isItemActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1'
                                    : 'hover:bg-white/5 hover:text-white',
                            );
                        }}
                    >
                        <item.icon
                            size={18}
                            className={cn(
                                'transition-colors',
                                'group-hover:text-blue-400',
                            )}
                        />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <NavLink
                    to="/admin/logout"
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300',
                            isActive && 'bg-red-500/10',
                        )
                    }
                >
                    <LogOut size={18} />
                    Logout
                </NavLink>
            </div>
        </aside>
    );
}
