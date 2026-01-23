import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '@/Features/admin/types';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter((n) => !n.isRead).length;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            const newNotification = { ...action.payload };

            const rawData = newNotification as any;
            const finalId = rawData._id || rawData.id;

            if (finalId) {
                newNotification._id = finalId;
            } else {
                newNotification._id = `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }

            // Check if notification already exists to avoid duplicates
            const isDuplicate = state.notifications.some(
                (n) => n._id === newNotification._id
            );

            if (isDuplicate) return;

            // Add to the beginning of the array
            state.notifications = [newNotification, ...state.notifications];

            // Increment unread count if applicable
            if (!newNotification.isRead) {
                state.unreadCount += 1;
            }
        },

        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(
                (n) => n._id === action.payload
            );
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((n) => (n.isRead = true));
            state.unreadCount = 0;
        },
    },
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead } =
    notificationSlice.actions;
export default notificationSlice.reducer;
