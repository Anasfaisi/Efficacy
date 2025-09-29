import api from '@/Services/axiosConfig';
import type {
  LoginCredentials,
  User,
  Role,
  RegisterCredentials,
} from '@/types/auth';
import { AuthMessages } from '@/utils/Constants';
import { AxiosError } from 'axios';

const ENDPOINTS: Record<Role, string> = {
  admin: '/admin/login',
  mentor: '/mentor/login',
  user: '/login',
};

export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const res = await api.get('/me');
    return res.data.user as User;
  } catch (error) {
    console.error('Failed to fetch the current user', error);
    throw new Error('unable to fetch user data');
  }
};

export const loginApi = async (
  credentials: LoginCredentials,
): Promise<User> => {
  const role: Role = (credentials.role ?? 'user') as Role;
  const endpoint = ENDPOINTS[role];

  try {
    console.log('sdfdsf');
    const res = await api.post(endpoint, credentials);
    console.log(res.data, 'res from api service ');
    return res.data.user as User;
  } catch (error) {
    console.log('error from the axioserror', error);
    if (error instanceof AxiosError) {
      throw error.response?.data?.message || 'Login failed';
    }
    console.log(error);
    throw AuthMessages.LoginFailure;
  }
};

export const logoutApi = async (): Promise<{ message: string }> => {
  try {
    const response = await api.post('/logout');
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data.message || ' logout failed';
    }
    throw AuthMessages.LogoutFailed;
  }
};

export const registerInitApi = async (
  credentials: RegisterCredentials,
): Promise<{ tempEmail: string; role: string }> => {
  try {
    const endpoint =
      credentials?.role === 'mentor'
        ? '/mentor/register/init'
        : '/register/init';
    const response = await api.post(endpoint, credentials);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data.message;
    }
    throw error;
  }
};

export const verifyOtpApi = async (
  email: string | null,
  otp: string,
  role: string | null,
): Promise<{ user: User }> => {
  try {
    const endpoint =
      role === 'mentor' ? '/mentor/register/verify' : '/register/verify';

    const response = await api.post(endpoint, { email, otp });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data.message || AuthMessages.OtpFailed;
    }
    throw AuthMessages.OtpFailed;
  }
};

export const resendOtpApi = async (
  email: string | null,
): Promise<{ message: string }> => {
  try {
    const response = await api.post('/register/resend-otp', { email });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data?.message || AuthMessages.ResenOtpFail;
    }
    throw error;
  }
};

export const forgotPasswordApi = async (
  email: string,
): Promise<{ message: string }> => {
  try {
    const response = await api.post('/forgot-password/init', { email });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data?.message || AuthMessages.ForgotFailed;
    }
    throw error;
  }
};

export const resetPasswordApi = async (
  token: string,
  newPassword: string,
): Promise<{ message: string }> => {
  try {
    const response = await api.post(`/forgot-password/verify`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data?.message || AuthMessages.ResetPasswordFailed;
    }
    throw error;
  }
};

export const googleLoginApi = async (
  googleToken: string,
  role: 'user' | 'mentor',
): Promise<{ user: User }> => {
  try {
    const endpoint =
      role === 'mentor' ? '/mentor/google-login' : '/google-login';
    const res = await api.post(endpoint, { googleToken, role });
    console.log(res, 'res');
    return res.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data?.message || AuthMessages.ResetPasswordFailed;
    }
    throw error;
  }
};
