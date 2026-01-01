import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Bell, User } from 'lucide-react';
import { connectSocket, onNewNotification, joinRoleRoom, offNotificationEvents } from '@/Services/socket/socketService';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { addNotification, setNotifications } from '@/redux/slices/notificationSlice';
import { adminService } from '@/Services/admin.api';
import { useNavigate } from 'react-router-dom';

export const NotificationListener: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') return;

        // Fetch initial notifications from backend
        adminService.getNotifications().then(data => {
            if (Array.isArray(data)) {
                dispatch(setNotifications(data));
            }
        }).catch(err => console.error('Failed to fetch notifications', err));

        // Connect and join room
        connectSocket();
        joinRoleRoom('admin');

        // Listen for real-time notifications
        onNewNotification((notification: any) => {
            console.log('Real-time notification received in Listener:', notification);
            
            // 1. Ensure the notification has a proper _id
            const processedNotification = { 
                ...notification, 
                _id: notification._id || notification.id || `temp-${Date.now()}` 
            };

            // 2. Update Redux State (This causes the counter to increment)
            dispatch(addNotification(processedNotification));
            
            // 3. Show Premium Popup (The "Pop")
            const isMentorApp = processedNotification.type?.includes('mentor_application');
            
            // Show standard toast first to verify system is working
            toast.info(processedNotification.title || 'New Notification');

            toast.custom((t: any) => (
                <div 
                    className={`${
                        t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-4'
                    } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden border border-blue-50 transition-all duration-300`}
                    style={{ zIndex: 9999 }}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                                    isMentorApp ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                                } shadow-sm`}>
                                    {isMentorApp ? <User size={24} /> : <Bell size={24} />}
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-bold text-gray-900 leading-tight">
                                    {processedNotification.title || (isMentorApp ? 'New Application' : 'System Alert')}
                                </p>
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                    {processedNotification.message}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 bg-gray-50/50 w-24">
                        {(processedNotification.metadata?.link || processedNotification.link) && (
                            <button
                                onClick={() => {
                                    navigate(processedNotification.metadata?.link || processedNotification.link);
                                    toast.dismiss(t.id);
                                }}
                                className="flex-1 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100/50 transition-colors border-b border-gray-100"
                            >
                                VIEW
                            </button>
                        )}
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="flex-1 px-4 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            ), {
                duration: 6000,
                position: 'top-right',
            });
        });

        return () => {
            offNotificationEvents();
        };
    }, [currentUser?.id, dispatch, navigate]);

    return null;
};
