import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCircle,
  BookOpen,
  LogOut,
} from 'lucide-react';

const MentorSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-20 hidden lg:flex flex-col">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            E
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Efficacy
          </h1>
        </div>

        <div className="space-y-1">
          <NavItem
            to="/mentor/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={isActive('/mentor/dashboard')}
          />
          <NavItem
            to="/mentor/students"
            icon={<Users size={20} />}
            label="My Mentees"
            active={isActive('/mentor/students')}
          />
          <NavItem
            to="/mentor/sessions"
            icon={<Calendar size={20} />}
            label="Sessions"
            active={isActive('/mentor/sessions')}
          />
          <NavItem
            to="/mentor/profile"
            icon={<UserCircle size={20} />}
            label="Profile"
            active={isActive('/mentor/profile')}
          />
           <NavItem
            to="/mentor/guidelines"
            icon={<BookOpen size={20} />}
            label="Guidelines"
            active={isActive('/mentor/guidelines')}
          />
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <button
           onClick={() => navigate('/mentor/logout')}
           className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active?: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      active
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default MentorSidebar;
