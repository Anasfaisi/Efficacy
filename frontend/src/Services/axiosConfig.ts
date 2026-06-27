import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { store } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
interface QueueItem {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (originalRequest.url?.includes('/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post('/refresh');

                isRefreshing = false;
                processQueue(null);
                return api(originalRequest);
            } catch (err) {
                isRefreshing = false;
                processQueue(err, null);
           
                store.dispatch(logout());
                
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
