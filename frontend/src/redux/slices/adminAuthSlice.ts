import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { adminApi } from '../../axiosAdminConfig';
import type { RootState } from '../store';
import { refreshAccessToken, logoutAdmin } from '../../ApiServices/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AdminAuthState {
  accessToken: string | null;
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiErrorResponse {
  message: string;
}

const initialState: AdminAuthState = {
  accessToken: null,
  user: null,
  isLoading: false,
  error: null,
};

export const adminLogin = createAsyncThunk<
  { accessToken: string; user: AdminUser },
  { email: string; password: string },
  { rejectValue: string }
>('adminAuth/adminLogin', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await adminApi.post('/login', { email, password });
    console.log('Admin login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return rejectWithValue(error.response?.data?.message || 'Admin login failed');
  }
});

export const checkAdminSession = createAsyncThunk<
  { accessToken: string; user: AdminUser },
  void,
  { rejectValue: string }
>('adminAuth/checkAdminSession', async (_, { rejectWithValue }) => {
  try {
    const response = await refreshAccessToken();
    return response.data;
  } catch (error: any) {
    console.error('Session check error:', error);
    return rejectWithValue(error.response?.data?.message || 'Session check failed');
  }
});

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.error = null;
    },
    resetAdminAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<{ accessToken: string; user: AdminUser }>) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(adminLogin.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Admin login failed';
      })
      .addCase(checkAdminSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAdminSession.fulfilled, (state, action: PayloadAction<{ accessToken: string; user: AdminUser }>) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(checkAdminSession.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Session check failed';
      });
  },
});

export const { adminLogout, resetAdminAuth } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
export const selectAdminAuth = (state: RootState) => state.adminAuth;