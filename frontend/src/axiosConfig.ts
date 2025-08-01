// src/api/axios.ts
import axios from 'axios';
import {store} from './redux/store'; // your configured redux store
import { logout, loginSuccess } from './redux/slices/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,  // for refresh token cookie
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt refresh token flow
      try {
        const response = await api.post('/auth/refresh');
        store.dispatch(loginSuccess({accessToken: response.data.accessToken, user: response.data.user}));
        error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
