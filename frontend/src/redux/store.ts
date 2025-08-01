import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// import adminAuthReducer from './slices/adminAuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/login',
          'auth/checkSession',
          'adminAuth/adminLogin',
          'adminAuth/checkAdminSession',
        ],
        ignoredPaths: ['auth.error', 'adminAuth.error'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;