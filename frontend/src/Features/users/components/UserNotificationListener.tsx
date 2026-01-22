import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Bell, MessageCircle } from 'lucide-react';
import {
    connectSocket,
    onNewNotification,
    joinRoleRoom,
    joinUserRoom,
    offNotificationEvents,
} from '@/Services/socket/socketService';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
    addNotification,
    markAsRead,
} from '@/redux/slices/notificationSlice';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/Features/admin/types';

export const UserNotificationListener: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleNotification = useCallback((notification: Notification) => {

        const processedNotification: Notification = {
            ...notification,
            _id: notification._id || `temp-${Date.now()}`,
        };

        dispatch(addNotification(processedNotification));

        const isMentorshipNotif = processedNotification.type?.includes('mentorship');

        toast.custom(
            (id) => (
                <div
                    className="w-full max-w-sm bg-white shadow-xl rounded-xl pointer-events-auto ring-1 ring-black/5 overflow-hidden p-4 border border-purple-100"
                    style={{ zIndex: 9999 }}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                    isMentorshipNotif
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-blue-100 text-blue-600'
                                }`}
                            >
                                {isMentorshipNotif ? (
                                    <MessageCircle size={20} />
                                ) : (
                                    <Bell size={20} />
                                )}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                                {processedNotification.title || 'New Notification'}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-3">
                                {processedNotification.message}
                            </p>
                            <div className="mt-3 flex items-center gap-3">
                                {!!processedNotification.metadata?.link && (
                                    <button
                                        onClick={async () => {
                                            const link = processedNotification.metadata?.link as string;
                                            if (processedNotification._id) {
                                                try {
                                                    dispatch(markAsRead(processedNotification._id));
                                                } catch (err) {
                                                    console.error('Auto-marking as read failed', err);
                                                }
                                            }
                                            if (link) navigate(link);
                                            toast.dismiss(id);
                                        }}
                                        className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                    >
                                        View
                                    </button>
                                )}
                                <button
                                    onClick={() => toast.dismiss(id)}
                                    className="text-sm font-medium text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => toast.dismiss(id)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ),
            {
                duration: 6000,
                position: 'top-right',
            },
        );
    }, [dispatch, navigate]);

    const currentUserId = (currentUser as any)?.id || (currentUser as any)?._id;

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'user') return;

        console.log('%c🔔 UserNotificationListener: Initializing socket for user:', 'color: #00D1FF; font-weight: bold', currentUserId);

        const socket = connectSocket();
        
        if (socket) {
            if (currentUserId) joinUserRoom(currentUserId);
            
            onNewNotification(handleNotification);
            
        }

        return () => {
            console.log('🧹 UserNotificationListener: Cleaning up...');
            offNotificationEvents();
        };
    }, [currentUserId, currentUser?.role, handleNotification]);

    return (
        <div id="user-notification-debug" style={{ display: 'none' }} data-active="true"></div>
    );
};
