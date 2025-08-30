// // axiosConfig.ts
// import axios from 'axios';
// import { store } from '../redux/store';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = store.getState().auth.accessToken ;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const response = await axios.post('http://localhost:5000/api/refresh', null, { withCredentials: true });
//         const newToken = response.data.accessToken;
//         // console.log("this is the new token generated",newToken)
//         store.dispatch({ type: 'auth/updateToken', payload: newToken });
//         localStorage.setItem('token', newToken);
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         store.dispatch({ type: 'auth/clearUser' });
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios,{AxiosError} from "axios"
const API_URL = import.meta.env.VITE_API_URL 

const api = axios.create({
  baseURL:API_URL,
  withCredentials:true
})


let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
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
    const originalRequest: any = error.config;

    
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
        
        await api.post("/auth/refresh");

        isRefreshing = false;
        processQueue(null);
        return api(originalRequest); 
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;