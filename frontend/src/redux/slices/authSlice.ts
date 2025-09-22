import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { type AuthState, type User } from '@/types/auth';

const initialState: AuthState = {
  accessToken: null,
  tempEmail: null,
  user: null,
  role: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
    },
    clearMessages(state) {
      state.user = null;
      state.successMessage = null;
    },
    logout: (state) => {
      state.user = null;
    },
    setTempUser: (
      state,
      action: PayloadAction<{ email: string; role: string }>,
    ) => {
      state.tempEmail = action.payload.email;
      state.role = action.payload.role;
    },
  },
});

export const { setCredentials, logout, setTempUser } = authSlice.actions;
export default authSlice.reducer;
