import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { markAsRead, markAllAsRead } from '@/redux/slices/notificationSlice';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '@/Services/user.api';

const BellButton: React.FC = () => {
    const { notifications, unreadCount } = useAppSelector(
        (state) => state.notification
    );
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllAsRead = async () => {
        dispatch(markAllAsRead());
        try {
            await userApi.markAllNotificationsAsRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        dispatch(markAsRead(id));
        try {
            await userApi.markNotificationAsRead(id);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleNotificationClick = (notif: any) => {
        if (!notif.isRead) {
            handleMarkAsRead(notif._id);
        }
        if (notif.metadata?.link) {
            navigate(notif.metadata.link as string);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-[#7F00FF] hover:bg-purple-50 rounded-xl transition-all"
            >
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
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h4 className="font-bold text-gray-900 text-sm">
                            Notifications
                        </h4>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-[10px] font-bold text-[#7F00FF] hover:underline uppercase tracking-wider flex items-center gap-1"
                            >
                                <CheckCheck size={12} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`relative p-4 border-b border-gray-50 transition-colors hover:bg-purple-50/30 ${
                                        !notif.isRead ? 'bg-purple-50/10' : ''
                                    }`}
                                >
                                    <div
                                        className="flex gap-3 cursor-pointer"
                                        onClick={() =>
                                            handleNotificationClick(notif)
                                        }
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                notif.type?.includes(
                                                    'mentorship'
                                                )
                                                    ? 'bg-purple-100 text-[#7F00FF]'
                                                    : 'bg-blue-100 text-blue-600'
                                            }`}
                                        >
                                            <Bell size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-6">
                                            <p className="text-xs font-bold text-gray-900 truncate">
                                                {notif.title}
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(
                                                    notif.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {!notif.isRead && (
                                        <button
                                            onClick={(e) =>
                                                handleMarkAsRead(notif._id, e)
                                            }
                                            className="absolute top-4 right-4 text-gray-400 hover:text-[#7F00FF] transition-colors p-1 hover:bg-purple-50 rounded-full"
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
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
                            onClick={() => {
                                navigate('/notifications');
                                setIsOpen(false);
                            }}
                        >
                            See all activity
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BellButton;
