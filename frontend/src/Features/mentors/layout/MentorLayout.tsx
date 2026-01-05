import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { type Mentor } from '@/types/auth';
import { Search, Bell } from 'lucide-react';
import MentorSidebar from './MentorSidebar';

const MentorLayout: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const mentor = currentUser as Mentor;
  const navigate = useNavigate();


  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      <MentorSidebar />
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            {/* Mobile Menu Trigger Placeholder */}
            <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search mentees, sessions..." 
                className="w-full bg-gray-50 border border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{mentor.name}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium capitalize">{mentor.mentorType} Mentor</p>
              </div>
              <div 
                 className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden cursor-pointer"
                 onClick={() => navigate('/mentor/profile')}
              >
                 {mentor.profilePic ? (
                    <img src={mentor.profilePic} alt={mentor.name} className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-indigo-600 font-bold text-lg">{mentor.name?.charAt(0)}</span>
                 )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 space-y-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MentorLayout;
