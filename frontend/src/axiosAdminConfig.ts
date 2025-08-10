// import axios, { AxiosError } from 'axios';
// import type { AxiosResponse } from 'axios';
// import { store } from './redux/store';
// import { refreshAccessToken, logoutAdmin } from './ApiServices/api';

// interface ApiErrorResponse {
//   message: string;
// }

// export const adminApi = axios.create({
//   baseURL: 'http://localhost:5000/api/admin',
//   withCredentials: true,
// });

// export const setupAdminAxiosInterceptors = () => {
//   adminApi.interceptors.response.use(
//     (response: AxiosResponse) => response,
//     async (error: AxiosError<ApiErrorResponse>) => {
//       const originalRequest = error.config as any;
//       if (
//         error.response?.status === 401 &&
        // !originalRequest._retry &&
//         error.response?.data?.message === 'Token expired'
//       ) {
//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then((token) => {
//               originalRequest.headers['Authorization'] = `Bearer ${token}`;
//               return adminApi(originalRequest);
//             })
//             .catch((err) => Promise.reject(err));
//         }

//         originalRequest._retry = true;
//         isRefreshing = false; // Reset isRefreshing to false to allow retry

//         try {
//           const response = await refreshAccessToken();
//           const { accessToken } = response.data;
//           originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//           store.dispatch({
//             type: 'adminAuth/checkAdminSession/fulfilled',
//             payload: response.data,
//           });
//           processQueue(null, accessToken);
//           return adminApi(originalRequest);
//         } catch (refreshError: any) {
//           processQueue(refreshError, null);
//           await logoutAdmin();
//           window.location.href = '/admin/login';
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       }
//       return Promise.reject(error);
//     },
//   );
// };

// let isRefreshing = false;
// let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void }> = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };