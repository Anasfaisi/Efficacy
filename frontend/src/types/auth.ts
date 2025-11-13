// import { z } from 'zod';

export type Role = 'admin' | 'mentor' | 'user';

export interface Subscription {
  id: string;
  status: 'active' | 'inactive' | 'canceled';
  priceId?: string;
  current_period_end?: Date;
}

export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: Role;

  bio?: string;
  headline?: string;
  profilePic?: string;
  dob?: string;

  stripeCustomerId?: string;
  subscription?: Subscription;

  walletBalance?: number;
  walletCurrency?: string;

  xpPoints?: number;
  badges?: string[];
  badge?: string;
  league?: string;

  currentStreak?: number;
  longestStreak?: number;
  lastActiveDate?: string | null;
  timezone?: string;

  profileCompletion?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  role: string | null;
  accessToken: null;
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

export interface LoginResponse {
  user?: User;
  message?: string;
}

export interface LogoutCredentials {
  role: Role;
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

export interface CredentialResponse {
  credential?: string;
}
