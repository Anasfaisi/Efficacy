import { useState } from 'react';
import { User, Info, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Notification } from '../types';

// Extended mock data
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'mentor',
        message: 'New mentor application submitted by John Doe',
        timestamp: '2023-10-27 10:30 AM',
        isRead: false,
        link: '/admin/mentors/review/1'
    },
    {
        id: '2',
        type: 'mentor',
        message: 'Mentor reapplication received from Jane Smith',
        timestamp: '2023-10-27 09:15 AM',
        isRead: false,
        link: '/admin/mentors/review/2'
    },
    {
        id: '3',
        type: 'system',
        message: 'System scheduled maintenance completed successfully',
        timestamp: '2023-10-26 11:00 PM',
        isRead: true
    },
    {
        id: '4',
        type: 'system',
        message: 'Database backup failed - Retry initiated',
        timestamp: '2023-10-26 04:00 PM',
        isRead: true
    },
    {
        id: '5',
        type: 'mentor',
        message: 'New mentor application submitted by Alice Johnson',
        timestamp: '2023-10-25 02:30 PM',
        isRead: true,
        link: '/admin/mentors/review/3'
    },
];

type FilterType = 'all' | 'mentor' | 'system';

export default function AdminNotificationsPage() {
    const [filter, setFilter] = useState<FilterType>('all');
    const navigate = useNavigate();

    const filteredNotifications = MOCK_NOTIFICATIONS.filter(n => {
        if (filter === 'all') return true;
        return n.type === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-gray-500 mt-1">Manage system alerts and mentor applications</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setFilter('all')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-all",
                            filter === 'all' ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('mentor')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-all",
                            filter === 'mentor' ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        Mentor Applications
                    </button>
                    <button
                        onClick={() => setFilter('system')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-md transition-all",
                            filter === 'system' ? "bg-purple-50 text-purple-700 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        System
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredNotifications.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                        {filteredNotifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={cn(
                                    "group flex items-start gap-4 p-5 transition-all hover:bg-gray-50 cursor-pointer",
                                    !notification.isRead ? "bg-blue-50/20" : ""
                                )}
                                onClick={() => notification.link ? navigate(notification.link) : null}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                        notification.type === 'mentor' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                                    )}
                                >
                                    {notification.type === 'mentor' ? <User size={20} /> : <Info size={20} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <p className={cn("text-base text-gray-900", !notification.isRead ? "font-semibold" : "font-medium")}>
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                            {notification.timestamp}
                                        </span>
                                    </div>
                                    <p className="max-w-xl text-sm text-gray-500 mt-1 line-clamp-1">
                                        {notification.type === 'mentor'
                                            ? "Review the application details, documents, and video submission."
                                            : "System details and logs available in the system panel."}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-sm font-medium text-blue-600 flex items-center">
                                        View Details <span className="ml-1">→</span>
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-10 text-center text-gray-500">
                        <Filter className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                        <p>No notifications found matching this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
