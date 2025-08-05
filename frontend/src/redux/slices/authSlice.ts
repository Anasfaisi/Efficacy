// // client/src/redux/slices/authSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from '@/utils/axiosConfig';
// import type { AuthState, User, LoginCredentials, RegisterCredentials } from '../types';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// export const register = createAsyncThunk<
//   { accessToken: string; user: User },
//   RegisterCredentials,
//   { rejectValue: string }
// >('auth/register', async ({ email, password, name }, { rejectWithValue }) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, { email, password, name });
//     console.log('Register response:', response);
//     return response.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || 'Registration failed');
//   }
// });

// export const refresh = createAsyncThunk<
//   { accessToken: string; user: User },
//   void,
//   { rejectValue: string }
// >('auth/refresh', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axios.post(`${API_URL}/refresh`);
//     return response.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || 'Refresh failed');
//   }
// });

// export const login = createAsyncThunk<
//   { accessToken: string; user: User },
//   LoginCredentials,
//   { rejectValue: string }
// >('auth/login', async ({ email, password }, { rejectWithValue }) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, { email, password });
//     console.log('Login response:', response);
//     return response.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || 'Login failed');
//   }
// });


// const initialState: AuthState = {
//   accessToken: null,
//   user: null,
//   isLoading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.accessToken = null;
//       state.user = null;
//       localStorage.removeItem('token');
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(register.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.accessToken = action.payload.accessToken;
//         state.user = action.payload.user;
//         localStorage.setItem('accessToken', action.payload.accessToken);
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || 'Registration failed';
//       })
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.accessToken = action.payload.accessToken;
//         state.user = action.payload.user;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
    
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AuthState, User, LoginCredentials, RegisterCredentials } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '[invalid url, do not cite]'
export const updateToken = createAction<string>('auth/updateToken');
export const clearUser = createAction('auth/clearUser');
// Create a local Axios instance
const createApi = () => axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Async thunks using local Axios
export const register = createAsyncThunk<
  { accessToken: string; user: User },
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async ({ email, password, name }, { rejectWithValue }) => {
  try {
    const api = createApi();
    const response = await api.post('/register', { email, password, name });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const refresh = createAsyncThunk<
  { accessToken: string; user: User },
  void,
  { rejectValue: string }
>('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const api = createApi();
    const response = await api.post('/refresh');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Refresh failed');
  }
});

export const login = createAsyncThunk<
  { accessToken: string; user: User },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const api = createApi();
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh
      .addCase(refresh.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(refresh.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Custom actions as requested
       .addCase(updateToken, (state, action: PayloadAction<string>) => {
        state.accessToken = action.payload;
        state.isLoading = false;
        localStorage.setItem('accessToken', action.payload);
      })
      .addCase(clearUser, (state) => {
        state.accessToken = null;
        state.user = null;
        state.isLoading = false;
        state.error = null;
        localStorage.removeItem('accessToken');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;