// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
// import { api } from '../../axiosConfig.ts';
// import type { RootState } from '../store.ts';
// import { refreshAccessToken, logoutAdmin } from '../../ApiServices/api.ts';

// interface AdminUser {
//   id: string;
//   email: string;
//   role: string;
// }

// interface AdminAuthState {
//   accessToken: string | null;
//   user: AdminUser | null;
//   isLoading: boolean;
//   error: string | null;
// }

// interface ApiErrorResponse {
//   message: string;
// }

// const initialState: AdminAuthState = {
//   accessToken: null,
//   user: null,
//   isLoading: false,
//   error: null,
// };

// export const adminLogin = createAsyncThunk<
//   { accessToken: string; user: AdminUser },
//   { email: string; password: string },
//   { rejectValue: string }
// >('adminAuth/adminLogin', async ({ email, password }, { rejectWithValue }) => {
//   try {
//     const response = await api.post('/admin/login', { email, password });
//     console.log('Admin login response:', response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error('Admin login error:', error);
//     return rejectWithValue(error.response?.data?.message || 'Admin login failed');
//   }
// });

// export const checkAdminSession = createAsyncThunk<
//   { accessToken: string; user: AdminUser },
//   void,
//   { rejectValue: string }
// >('adminAuth/checkAdminSession', async (_, { rejectWithValue }) => {
//   try {
//     const response = await refreshAccessToken(true);
//     return response.data;
//   } catch (error: any) {
//     console.error('Session check error:', error);
//     return rejectWithValue(error.response?.data?.message || 'Session check failed');
//   }
// });


// export const adminLogoutThunk = createAsyncThunk<
//   void,
//   void,
//   { rejectValue: string }
// >('adminAuth/adminLogoutThunk', async (_, { dispatch, rejectWithValue }) => {
//   try {
//     await logoutAdmin();
//     dispatch(adminLogout());
//   } catch (error: any) {
//     console.error('Admin logout error:', error);
//     return rejectWithValue(error.response?.data?.message || 'Admin logout failed');
//   }
// });


// const adminAuthSlice = createSlice({
//   name: 'adminAuth',
//   initialState,
//   reducers: {
//     adminLogout: (state) => {
//       state.accessToken = null;
//       state.user = null;
//       state.error = null;
//     },
//     resetAdminAuth: (state) => {
//       state.accessToken = null;
//       state.user = null;
//       state.isLoading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(adminLogin.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(adminLogin.fulfilled, (state, action: PayloadAction<{ accessToken: string; user: AdminUser }>) => {
//         state.isLoading = false;
//         state.accessToken = action.payload.accessToken;
//         state.user = action.payload.user;
//       })
//       .addCase(adminLogin.rejected, (state, action: PayloadAction<string | undefined>) => {
//         state.isLoading = false;
//         state.error = action.payload || 'Admin login failed';
//       })
//       .addCase(checkAdminSession.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(checkAdminSession.fulfilled, (state, action: PayloadAction<{ accessToken: string; user: AdminUser }>) => {
//         state.isLoading = false;
//         state.accessToken = action.payload.accessToken;
//         state.user = action.payload.user;
//       })
//       .addCase(checkAdminSession.rejected, (state, action: PayloadAction<string | undefined>) => {
//         state.isLoading = false;
//         state.error = action.payload || 'Session check failed';
//       });
//   },
// });

// export const { adminLogout, resetAdminAuth } = adminAuthSlice.actions;
// export default adminAuthSlice.reducer;
// export const selectAdminAuth = (state: RootState) => state.adminAuth;