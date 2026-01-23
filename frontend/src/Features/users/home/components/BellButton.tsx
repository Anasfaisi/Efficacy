import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { markAsRead, markAllAsRead } from '@/redux/slices/notificationSlice';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BellButton: React.FC = () => {
    const { notifications, unreadCount } = useAppSelector(
        (state) => state.notification
    );
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <div className="relative group">
            <button className="relative p-2 text-gray-600 hover:text-[#7F00FF] hover:bg-purple-50 rounded-xl transition-all">
                <Bell
                    size={24}
                    className={unreadCount > 0 ? 'animate-wiggle' : ''}
                />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h4 className="font-bold text-gray-900 text-sm">
                        Notifications
                    </h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => dispatch(markAllAsRead())}
                            className="text-[10px] font-bold text-[#7F00FF] hover:underline uppercase tracking-wider"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                        notifications.slice(0, 10).map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => {
                                    if (!notif.isRead)
                                        dispatch(markAsRead(notif._id));
                                    if (notif.metadata?.link)
                                        navigate(notif.metadata.link as string);
                                }}
                                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-purple-50/30 ${!notif.isRead ? 'bg-purple-50/10' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.type?.includes('mentorship') ? 'bg-purple-100 text-[#7F00FF]' : 'bg-blue-100 text-blue-600'}`}
                                    >
                                        <Bell size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">
                                            {notif.title}
                                        </p>
                                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="w-2 h-2 bg-[#7F00FF] rounded-full mt-1 flex-shrink-0"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bell size={24} className="text-gray-300" />
                            </div>
                            <p className="text-xs text-gray-400 font-medium">
                                No notifications yet
                            </p>
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <button
                        className="w-full py-3 text-xs font-bold text-gray-500 hover:text-[#7F00FF] hover:bg-gray-50 transition-colors border-t border-gray-50"
                        onClick={() => navigate('/notifications')}
                    >
                        See all activity
                    </button>
                )}
            </div>
        </div>
    );
};

export default BellButton;
