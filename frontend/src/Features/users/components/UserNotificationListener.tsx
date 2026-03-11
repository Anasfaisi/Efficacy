import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Bell, MessageCircle } from 'lucide-react';
import {
    connectSocket,
    onNewNotification,
    joinUserRoom,
    offNotificationEvents,
    onBadgeUnlocked,
} from '@/Services/socket/socketService';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
    addNotification,
    markAsRead,
    setNotifications,
} from '@/redux/slices/notificationSlice';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/Features/admin/types';
import { getNotifications } from '@/Services/user.api';

export const UserNotificationListener: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleNotification = useCallback(
        (notification: Notification) => {
            const processedNotification: Notification = {
                ...notification,
                _id: notification._id || `temp-${Date.now()}`,
            };

            dispatch(addNotification(processedNotification));

            const isMentorshipNotif =
                processedNotification.type?.includes('mentorship');

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
                                    {processedNotification.title ||
                                        'New Notification'}
                                </p>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-3">
                                    {processedNotification.message}
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    {!!processedNotification.metadata?.link && (
                                        <button
                                            onClick={async () => {
                                                const link =
                                                    processedNotification
                                                        .metadata
                                                        ?.link as string;
                                                if (processedNotification._id) {
                                                    try {
                                                        dispatch(
                                                            markAsRead(
                                                                processedNotification._id
                                                            )
                                                        );
                                                    } catch (err) {
                                                        console.error(
                                                            'Auto-marking as read failed',
                                                            err
                                                        );
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
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                ),
                {
                    duration: 6000,
                    position: 'top-right',
                }
            );
        },
        [dispatch, navigate]
    );

    const currentUserId = currentUser
        ? ('id' in currentUser ? currentUser.id : undefined) ||
          ('_id' in currentUser
              ? (currentUser as { _id?: string })._id
              : undefined)
        : undefined;

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'user') return;

        getNotifications()
            .then((data) => {
                if (Array.isArray(data)) {
                    dispatch(setNotifications(data));
                }
            })
            .catch((err) => {
                console.error('Failed to fetch user notifications', err);
            });

        const socket = connectSocket();

        if (socket) {
            if (currentUserId) joinUserRoom(currentUserId);

            onNewNotification(handleNotification);

            onBadgeUnlocked((payload) => {
                const badge = payload.badge;
                toast.custom(
                    (id) => (
                        <div className="w-full max-w-sm bg-gradient-to-br from-indigo-900 to-black shadow-2xl rounded-2xl pointer-events-auto overflow-hidden p-5 border border-indigo-500/50 relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <svg
                                    className="w-24 h-24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-center gap-3 relative z-10 text-center">
                                <div className="animate-bounce">
                                    <span className="text-4xl">🏆</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1">
                                        Badge Unlocked!
                                    </h3>
                                    <p className="text-indigo-200 font-bold text-xl">
                                        {badge.name}
                                    </p>
                                    <p className="text-sm text-indigo-300/80 mt-2 italic">
                                        "{badge.story}"
                                    </p>
                                </div>
                                <button
                                    onClick={() => toast.dismiss(id)}
                                    className="mt-2 w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-xl transition-colors"
                                >
                                    Awesome
                                </button>
                            </div>
                        </div>
                    ),
                    { duration: 8000, position: 'top-center' }
                );
            });

            socket.on('connect', () => {
                console.log('User socket connected, re-joining room');
                if (currentUserId) joinUserRoom(currentUserId);
            });
        }

        return () => {
            console.log('🧹 UserNotificationListener: Cleaning up...');
            offNotificationEvents();
            socket?.off('connect');
        };
    }, [currentUserId, currentUser?.role, handleNotification]);

    return (
        <div
            id="user-notification-debug"
            style={{ display: 'none' }}
            data-active="true"
        ></div>
    );
};
