import { z } from "zod";

export type Role = "admin" | "mentor" | "user"; 
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthState {
  accessToken: null,
  user: User | null;
  isLoading: boolean;
  error: string | null | undefined;
  tempEmail: string | null;
  successMessage?: string | null;
}
export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
    role: Role;
}
export interface LoginCredentials {
  email: string;
  password: string;
  role?: Role;
}

export interface LogoutCredentials {
  role:Role;
}

export interface GooglecredentialUser {
  email: string;
  name: string;
  password: string;
  role: Role;
}

export interface GoogleLoginArg {
  googleToken: string;
  role: Role;
}
