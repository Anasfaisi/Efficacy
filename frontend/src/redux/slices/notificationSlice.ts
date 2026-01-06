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
            // Ensure _id exists (handle id vs _id)
            const data = newNotification as unknown as {
                id?: string;
                _id?: string;
            };
            if (!data._id && data.id) {
                newNotification._id = data.id;
            }

            // Check if notification already exists to avoid duplicates
            if (
                state.notifications.some((n) => n._id === newNotification._id)
            ) {
                return;
            }

            state.notifications = [newNotification, ...state.notifications];
            if (!newNotification.isRead) {
                state.unreadCount += 1;
            }
        },

        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(
                (n) => n._id === action.payload,
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
