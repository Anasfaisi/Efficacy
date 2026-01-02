import React, { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { type Mentor } from '@/types/auth';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCircle,
  BookOpen,
  LogOut,
  Bell,
  Search,
  Upload,
  AlertCircle,
} from 'lucide-react';

const MentorDashboard: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const mentor = currentUser as Mentor;

  useEffect(() => {
    if (currentUser?.role === 'mentor') {
      const status = mentor.status;

      if (status === 'incomplete' || !status || status === 'reapply') {
        navigate('/mentor/onboarding');
      } else if (status === 'pending') {
        navigate('/mentor/application-received');
      } else if (status === 'rejected') {
        navigate('/mentor/application-rejected');
      } else if (status === 'inactive') {
        toast.error('Your account is currently inactive. Please contact support.');
        navigate('/mentor/login');
      }
      // If approved or active, stay here
    }
  }, [currentUser, navigate, mentor]);

  const isActive = (path: string) => location.pathname === path;

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            {/* Mobile Menu Trigger (not implemented for brevity but placeholder) */}
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
              <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden">
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
           {/* Profile Picture Reminder */}
           {!mentor.profilePic && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-1 shadow-lg shadow-indigo-200 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Complete your profile</h3>
                      <p className="text-gray-500 text-sm mt-1">Add a profile picture to make your profile stand out to potential mentees.</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => navigate('/mentor/profile')}
                   className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                 >
                    <Upload size={16} />
                    Upload Photo
                 </button>
              </div>
            </div>
           )}

           {/* Stats Overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Mentees" value="0" icon={<Users className="text-blue-500" />} trend="+0% this month" />
              <StatCard title="Upcoming Sessions" value="0" icon={<Calendar className="text-purple-500" />} trend="Next in 2 days" />
              <StatCard title="Profile Views" value="24" icon={<UserCircle className="text-orange-500" />} trend="+12% this week" />
              <StatCard title="Average Rating" value="0.0" icon={<AwardStar className="text-yellow-500" />} trend="No ratings yet" />
           </div>

           {/* Quick Actions / Recent Activity Placeholder */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[400px]">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent Sessions</h3>
                    <button className="text-indigo-600 text-sm font-semibold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                      View All
                    </button>
                 </div>
                 <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                       <Calendar className="text-gray-300 w-8 h-8" />
                    </div>
                    <p className="text-gray-500 font-medium">No sessions scheduled yet</p>
                    <button className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      Schedule Availability
                    </button>
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                 <h3 className="text-lg font-bold text-gray-900 mb-6">Upcoming</h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-sm text-gray-500 mb-1">Tomorrow, 10:00 AM</p>
                       <p className="font-semibold text-gray-900">Orientation Session</p>
                       <div className="flex items-center gap-2 mt-3">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-xs text-gray-600 font-medium">Confirmed</span>
                       </div>
                    </div>
                      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                       <div className="flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                         <div>
                            <p className="text-sm font-semibold text-indigo-900">Complete Profile</p>
                            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                               Add your skills and bio to get better matches.
                            </p>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
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

const StatCard = ({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 mt-2">{value}</h4>
      </div>
      <div className="p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
         ↑
      </span>
      <span className="text-xs text-gray-500 font-medium">{trend}</span>
    </div>
  </div>
);

const AwardStar = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
);

export default MentorDashboard;
