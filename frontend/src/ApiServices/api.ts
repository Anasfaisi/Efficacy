// src/api/authService.ts
import api from '@/axiosConfig';

export async function loginUser(credentials: { email: string; password: string }) {
  const response = await api.post('/login', credentials);
  return response.data; 
}
