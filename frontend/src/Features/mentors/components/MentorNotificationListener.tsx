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
import { mentorApi } from '@/Services/mentor.api';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/Features/admin/types';
import type { Mentor } from '@/types/auth';

export const MentorNotificationListener: React.FC = () => {
    let { currentUser } = useAppSelector((state) => state.auth);
    currentUser = currentUser as Mentor
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Memoize the notification handler to prevent unnecessary re-registrations
    const handleNotification = useCallback((notification: Notification) => {
        console.log('Mentor notification received in mentor NotificatoinListener.tsx======================:', notification);

        const processedNotification: Notification = {
            ...notification,
            _id: notification._id || `temp-${Date.now()}`,
        };

        dispatch(addNotification(processedNotification));

        const isMentorshipRequest = processedNotification.type?.includes('mentorship_request');

        toast.custom(
            (id) => (
                <div
                    className="w-full max-w-sm bg-white shadow-xl rounded-xl pointer-events-auto ring-1 ring-black/5 overflow-hidden p-4 border border-indigo-100"
                    style={{ zIndex: 9999 }}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                    isMentorshipRequest
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-blue-100 text-blue-600'
                                }`}
                            >
                                {isMentorshipRequest ? (
                                    <Users size={20} />
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
                                                    await mentorApi.markNotificationAsRead(processedNotification._id);
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
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
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

        // Fetch initial notifications
        mentorApi.getNotifications()
            .then((data) => {
                if(Array.isArray(data)){
                dispatch(setNotifications(data));
                }
            })
            .catch(err => {
                console.error("Failed to fetch mentor notifications", err);
            });

        // console.log('%c🔔 MentorNotificationListener: Initializing socket for mentor:', 'color: #7F00FF; font-weight: bold', currentUserId);

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
                // joinRoleRoom('mentor');
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

