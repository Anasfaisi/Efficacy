import type { AxiosResponse } from 'axios';
import { store } from '../redux/store';
import axios  from 'axios';
import { adminLogout } from '../redux/slices/adminAuthSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const refreshAccessToken = async (isAdmin: boolean = true): Promise<AxiosResponse> => {
  const endpoint = isAdmin ? '/admin/refresh-token' : '/auth/refresh-token';
  return axios.post(`${API_URL}${endpoint}`, {}, { withCredentials: true });
};

export const logoutAdmin = async (): Promise<void> => {
  await axios.post(`${API_URL}/admin/logout`, {}, { withCredentials: true });
  store.dispatch(adminLogout());
};

export const fetchAdminDashboardData = (accessToken: string): Promise<AxiosResponse> => {
  return axios.get(`${API_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
