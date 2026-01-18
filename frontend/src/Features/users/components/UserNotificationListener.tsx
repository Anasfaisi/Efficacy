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
    setNotifications,
    markAsRead,
} from '@/redux/slices/notificationSlice';
import { notificationApi } from '@/Services/notification.api';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/Features/admin/types';

export const UserNotificationListener: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleNotification = useCallback((notification: Notification) => {
        console.log('%c👤 User notification received:', 'color: #00D1FF; font-weight: bold', notification);

        const processedNotification: Notification = {
            ...notification,
            _id: notification._id || `temp-${Date.now()}`,
        };

        dispatch(addNotification(processedNotification));

        const isMentorshipNotif = processedNotification.type?.includes('mentorship');

        toast.custom(
            (id) => (
                <div
                    className="animate-in fade-in slide-in-from-top-4 max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden border border-purple-50"
                    style={{ zIndex: 9999 }}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div
                                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                                        isMentorshipNotif
                                            ? 'bg-purple-50 text-purple-600'
                                            : 'bg-blue-50 text-blue-600'
                                    } shadow-sm`}
                                >
                                    {isMentorshipNotif ? (
                                        <MessageCircle size={24} />
                                    ) : (
                                        <Bell size={24} />
                                    )}
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-bold text-gray-900 leading-tight">
                                    {processedNotification.title || 'New Notification'}
                                </p>
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                    {processedNotification.message}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 bg-gray-50/50 w-24">
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
                                className="flex-1 px-4 py-2 text-xs font-bold text-purple-600 hover:bg-purple-100/50 transition-colors border-b border-gray-100"
                            >
                                VIEW
                            </button>
                        )}
                        <button
                            onClick={() => toast.dismiss(id)}
                            className="flex-1 px-4 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            CLOSE
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
        
        notificationApi.getNotifications()
            .then((notifications) => {
                dispatch(setNotifications(notifications));
            })
            .catch((err) => {
                console.error('Failed to fetch user notifications:', err);
            });

        console.log('%c🔔 UserNotificationListener: Initializing socket for user:', 'color: #00D1FF; font-weight: bold', currentUserId);

        const socket = connectSocket();
        
        if (socket) {
            joinRoleRoom('user');
            if (currentUserId) joinUserRoom(currentUserId);
            
            onNewNotification(handleNotification);
            
            socket.on('connect', () => {
                console.log('🚀 UserNotificationListener: Connected!', socket.id);
                joinRoleRoom('user');
                if (currentUserId) joinUserRoom(currentUserId);
            });
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
