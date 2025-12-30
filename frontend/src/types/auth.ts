// import { z } from 'zod';

export type Role = 'admin' | 'mentor' | 'user';
export type currentUserType = User | Mentor | Admin;

export interface Subscription {
  id: string;
  status: 'active' | 'inactive' | 'canceled';
  priceId?: string;
  current_period_end?: Date;
}

export interface Admin {
  id: string;
  email: string;
  role: Role;
}

export interface Mentor {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  status: string;

  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  profilePic?: string;
  publicProfile?: string;

  qualification?: string;
  university?: string;
  graduationYear?: string;

  experienceYears?: string;
  skills?: string;
  experienceSummary?: string;

  availableDays?: string;
  preferredTime?: string;
  sessionsPerWeek?: string;

  resume?: string;
  certificate?: string;
  idProof?: string;

  isVerified?: boolean;
  expertise?: string;

  // Keep timestamp just in case
  createdAt?: string;
  updatedAt?: string;
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
  currentUser: currentUserType | null;
  tempEmail: string | null;
  role: string | null;
  isLoading: boolean;
  error: string | null | undefined;
  resendAvailableAt: string | null;
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
  // admin?: Admin;
  user?: currentUserType;
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

// otp
export type VerifyOtpSuccess = {
  success: true;
  user: User;
};

export type VerifyOtpError = {
  success: false;
  message: string;
};

export type VerifyOtpResponse = VerifyOtpSuccess | VerifyOtpError;

export interface ResendOtpResponse {
  tempEmail: string;
  message: string;
  resendAvailableAt: string;
  role: string;
}
