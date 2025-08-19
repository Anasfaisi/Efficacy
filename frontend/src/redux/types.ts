import { z } from "zod";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "mentor" | "user";
}

export interface AuthState {
  accessToken: string | null;
  tempUserId:string | null
  user: User | null;
  isLoading: boolean;
  error: string | null |undefined;
  email:string|null
  successMessage?: string | null;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role: "user" | "mentor";
  tempUserId:string
}
export interface LoginCredentials {
  email: string;
  password: string;
  role?: "admin" | "user" | "mentor";
}

export interface LogoutCredentials {
  role: "admin" | "user" | "mentor";
}

export interface GooglecredentialUser {
  email: string;
  name: string;
  password: string;
  role: "user" | "admin" | "mentor";
}

export interface GoogleLoginArg {
  googleToken: string;
  role: "user" | "mentor" | "admin";
}
