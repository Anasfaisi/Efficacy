import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import chatReducer from '@/redux/slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import pomodoroReducer from './slices/pomodoroSlice';

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['currentUser', 'role', 'resendAvailableAt', 'tempEmail'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const chatPersistConfig = {
    key: 'chat',
    storage,
    whitelist: ['messages', 'currentRoomId'],
};

const pomodoroPersistConfig = {
    key: 'pomodoro',
    storage,
};

const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedPomodoroReducer = persistReducer(pomodoroPersistConfig, pomodoroReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        chat: persistedChatReducer,
        notification: notificationReducer,
        pomodoro: persistedPomodoroReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
