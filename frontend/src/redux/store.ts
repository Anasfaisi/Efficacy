import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import chatReducer from '@/redux/slices/chatSlice';

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['currentUser', 'role'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
// ✅ Optional: Persist config for chat (if you want to keep messages)
const chatPersistConfig = {
  key: 'chat',
  storage,
  whitelist: ['messages', 'currentRoomId'], // store messages and last active room
};

const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    chat: persistedChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
