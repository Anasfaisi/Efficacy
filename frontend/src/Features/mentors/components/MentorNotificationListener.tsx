import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Bell, Users } from 'lucide-react';
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

export const MentorNotificationListener: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    console.log("it is woriing=============================")
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Memoize the notification handler to prevent unnecessary re-registrations
    const handleNotification = useCallback((notification: Notification) => {
        console.log('Mentor notification received:', notification);

        const processedNotification: Notification = {
            ...notification,
            _id: notification._id || `temp-${Date.now()}`,
        };

        dispatch(addNotification(processedNotification));

        const isMentorshipRequest = processedNotification.type?.includes('mentorship_request');

        toast.custom(
            (id) => (
                <div
                    className="animate-in fade-in slide-in-from-top-4 max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden border border-indigo-50"
                    style={{ zIndex: 9999 }}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div
                                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                                        isMentorshipRequest
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'bg-blue-50 text-blue-600'
                                    } shadow-sm`}
                                >
                                    {isMentorshipRequest ? (
                                        <Users size={24} />
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
                                            // Mark as read (you'll need to add this API method)
                                            dispatch(markAsRead(processedNotification._id));
                                        } catch (err) {
                                            console.error('Auto-marking as read failed', err);
                                        }
                                    }
                                    if (link) {
                                        navigate(link);
                                    }
                                    toast.dismiss(id);
                                }}
                                className="flex-1 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100/50 transition-colors border-b border-gray-100"
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
    }, [dispatch, navigate]); // Only re-create if dispatch or navigate change (they won't)

    const currentUserId = (currentUser as any)?.id || (currentUser as any)?._id;

    useEffect(() => {
        if (!currentUser) {
            console.warn('⚠️ MentorNotificationListener: No current user found in Redux state');
            return;
        }
        if (currentUser.role !== 'mentor') {
            console.warn('⚠️ MentorNotificationListener: User role is not mentor:', currentUser.role);
            return;
        }

        // Fetch existing notifications
        notificationApi.getNotifications()
            .then((notifications) => {
                dispatch(setNotifications(notifications));
            })
            .catch((err) => {
                console.error('Failed to fetch notifications:', err);
            });

        console.log('%c🔔 MentorNotificationListener: Initializing socket for mentor:', 'color: #7F00FF; font-weight: bold', currentUserId);

        // Connect to socket and join mentor room
        const socket = connectSocket();
        
        if (socket) {
            console.log('✅ MentorNotificationListener: Socket instance obtained, joining mentor rooms...');
            joinRoleRoom('mentor');
            if (currentUserId) joinUserRoom(currentUserId);
            
            // Catch-all listener for debugging
            socket.onAny((eventName, ...args) => {
                console.log(`🔍 Socket event: ${eventName}`, args);
            });
            
            // Listen for real-time notifications with memoized handler
            onNewNotification(handleNotification);
            
            // Log when connected
            socket.on('connect', () => {
                console.log('🚀 MentorNotificationListener: Socket connected! Socket ID:', socket.id);
                joinRoleRoom('mentor');
                if (currentUserId) joinUserRoom(currentUserId);
            });
        } else {
            console.error('❌ MentorNotificationListener: Failed to get socket instance');
        }

        return () => {
            console.log('🧹 MentorNotificationListener: Cleaning up socket events...');
            offNotificationEvents();
        };
        // Only re-run if currentUser ID changes or handler changes
    }, [currentUserId, currentUser?.role, handleNotification]);

    // Expose for browser console debugging
    (window as any).__mentor_listener_active = true;

    return (
        <div 
            id="mentor-notification-debug" 
            style={{ display: 'none' }} 
            data-active="true"
        ></div>
    );
};
