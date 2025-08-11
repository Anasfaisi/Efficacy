import { z } from "zod";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "mentor" | "user";
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
  role : 'user' | 'mentor';
}
export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'admin' | 'user' | 'mentor';
}

export interface LogoutCredentials {
  role: "admin" | "user" | "mentor";
}
