import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { type Mentor } from '@/types/auth';
import MentorSidebar from './MentorSidebar';
import { MentorNotificationListener } from '../components/MentorNotificationListener';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { markAsRead, markAllAsRead } from '@/redux/slices/notificationSlice';
import { mentorApi } from '@/Services/mentor.api';

const MentorLayout: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const { notifications, unreadCount } = useAppSelector((state) => state.notification);
    const dispatch = useAppDispatch();
    console.log(notifications,"checking the notifications on the mentor side")
    // console.log('MentorLayout: Rendering, currentUser:', currentUser ? { id: currentUser.id, role: currentUser.role } : 'NULL');

    const mentor = currentUser as Mentor;
    const navigate = useNavigate();

    if (!currentUser) {
        console.log('MentorLayout: No current user, returning null');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
            <MentorNotificationListener />
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
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search mentees, sessions..."
                                className="w-full bg-gray-50 border border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-auto">
                        <div className="relative group/bell">
                            <button 
                                className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 active:scale-95"
                                onClick={() => {
                                    // Toggle logic can be added if needed, for now just show count and provide tooltip
                                }}
                            >
                                <Bell size={22} className={unreadCount > 0 ? "animate-wiggle" : ""} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-red-200">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            
                            {/* Notification Dropdown (Modern) */}
                            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover/bell:opacity-100 group-hover/bell:visible transition-all duration-200 z-50 transform origin-top-right group-hover/bell:translate-y-0 translate-y-2">
                                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                    <h4 className="font-bold text-gray-900 text-sm">Notifications</h4>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await mentorApi.markAllNotificationsAsRead();
                                                    dispatch(markAllAsRead());
                                                } catch (err) {
                                                    console.error("Failed to mark all as read", err);
                                                }
                                            }}
                                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[350px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div 
                                                key={notif._id}
                                                onClick={() => {
                                                    if (!notif.isRead) dispatch(markAsRead(notif._id));
                                                    if (notif.metadata?.link) navigate(notif.metadata.link as string);
                                                }}
                                                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-indigo-50/30 ${!notif.isRead ? "bg-indigo-50/10" : ""}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.type === 'mentorship_request' ? "bg-indigo-100 text-indigo-600" : "bg-blue-100 text-blue-600"}`}>
                                                        <Bell size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{notif.title}</p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                                        <p className="text-[9px] text-gray-400 mt-2 font-medium">3 mins ago</p>
                                                    </div>
                                                    {!notif.isRead && (
                                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Bell size={20} className="text-gray-300" />
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">No notifications yet</p>
                                        </div>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={() => navigate('/mentor/notifications')}
                                        className="w-full py-3 text-xs font-bold text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors border-t border-gray-50"
                                    >
                                        View all notifications
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 leading-none">
                                    {mentor.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 font-medium capitalize">
                                    {mentor.mentorType} Mentor
                                </p>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-95"
                                onClick={() => navigate('/mentor/profile')}
                            >
                                {mentor.profilePic ? (
                                    <img
                                        src={mentor.profilePic}
                                        alt={mentor.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-indigo-600 font-bold text-lg">
                                        {mentor.name?.charAt(0)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 space-y-8 animate-in fade-in duration-500">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MentorLayout;
