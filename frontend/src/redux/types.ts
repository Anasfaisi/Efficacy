import {z} from "zod";


export interface User {
  id:string;
  email: string;
  name: string;
role: 'admin' | 'mentor' | 'user';
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}


