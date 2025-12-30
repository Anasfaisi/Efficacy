import { useState, useRef, useEffect } from 'react';
import { Bell, User, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Notification } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'mentor',
        message: 'New mentor application submitted',
        timestamp: '10 min ago',
        isRead: false,
        link: '/admin/mentors/review/1'
    },
    {
        id: '2',
        type: 'mentor',
        message: 'Mentor reapplication received',
        timestamp: '2 hours ago',
        isRead: false,
        link: '/admin/mentors/review/2'
    },
    {
        id: '3',
        type: 'system',
        message: 'System maintenance scheduled',
        timestamp: '1 day ago',
        isRead: true
    },
];

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Use mock data for now
    const notifications = MOCK_NOTIFICATIONS;
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read logic would go here
        setIsOpen(false);
        if (notification.link) {
            navigate(notification.link);
        } else {
            // If no link, maybe go to notification list?
            navigate('/admin/notifications');
        }
    };

    const handleViewAll = () => {
        setIsOpen(false);
        navigate('/admin/notifications');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-700">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3",
                                        !notification.isRead ? "bg-blue-50/30" : ""
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                        notification.type === 'mentor' ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                                    )}>
                                        {notification.type === 'mentor' ? <User size={16} /> : <Info size={16} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-sm text-gray-800 leading-snug", !notification.isRead && "font-medium")}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                                    </div>

                                    {notification.link && (
                                        <div className="flex items-center">
                                            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50">
                                                View
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                        <button
                            onClick={handleViewAll}
                            className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors w-full py-1"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
