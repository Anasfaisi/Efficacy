import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { type AuthState, type currentUserType } from '@/types/auth';

const initialState: AuthState = {
    tempEmail: null,
    role: null,
    resendAvailableAt: null,
    currentUser: null,
    isLoading: false,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ currentUser: currentUserType }>,
        ) => {
            state.currentUser = action.payload.currentUser;
            state.isLoading = false;
            state.error = null;
            state.role = action.payload.currentUser.role;
        },

        clearMessages(state) {
            state.currentUser = null;
            state.successMessage = null;
        },
        logout: (state) => {
            state.currentUser = null;
        },
        setTempUser: (
            state,
            action: PayloadAction<{
                email: string;
                role: string;
                resendAvailableAt: string;
            }>,
        ) => {
            state.tempEmail = action.payload.email;
            state.resendAvailableAt = action.payload.resendAvailableAt;
            state.role = action.payload.role;
        },
        updateCurrentUser: (
            state,
            action: PayloadAction<Partial<currentUserType>>,
        ) => {
            if (state.currentUser) {
                state.currentUser = { ...state.currentUser, ...action.payload };
            }
        },
    },
});

export const { setCredentials, logout, setTempUser, updateCurrentUser } =
    authSlice.actions;
export default authSlice.reducer;
