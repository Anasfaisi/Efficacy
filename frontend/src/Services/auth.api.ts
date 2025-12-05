import api from '@/Services/axiosConfig';
import type {
  LoginCredentials,
  User,
  Role,
  RegisterCredentials,
  LoginResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
} from '@/types/auth';
import type { ProfileForm } from '@/types/profile';
import { AuthMessages } from '@/utils/Constants';
import { AxiosError } from 'axios';

const ENDPOINTS: Record<Role, string> = {
  admin: '/admin/login',
  mentor: '/mentor/login',
  user: '/login',
};

export const fetchCurrentUser = async (
  id: string | undefined,
): Promise<User> => {
  try {
    const res = await api.get(`/me/${id}`);
    console.log(res);
    return res.data.user as User;
  } catch (error) {
    console.error('Failed to fetch the current user', error);
    throw new Error('unable to fetch user data');
  }
};

export const loginApi = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const role: Role = (credentials.role ?? 'user') as Role;
  const endpoint = ENDPOINTS[role];

  try {
    console.log(credentials,"auth api")
    const res = await api.post(endpoint, credentials);
    console.log(res.data, 'from aut');

    return res.data 
  } catch (error) {
    if (error instanceof AxiosError) {
      return { message: error.response?.data?.message || 'Login failed' };
    }
    console.log(error);
    return { message: 'Login failed' };
  }
};

export const adminLoginApi = async (credentials: LoginCredentials) => {
  const role: Role = (credentials.role ?? 'admin') as Role;
  const endpoint = ENDPOINTS[role];
  try {
    const res = await api.post(endpoint, credentials);
    console.log(res.data,"from auth api");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const logoutApi = async (): Promise<{ message: string }> => {
  try {
    const response = await api.post('/logout');
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
): Promise<{
  tempEmail: string;
  message: string;
  role: string;
  resendAvailableAt: string;
}> => {
  try {
    const endpoint =
      credentials?.role === 'mentor'
        ? '/mentor/register/init'
        : '/register/init';
    const response = await api.post(endpoint, credentials);
    console.log(response, 'from auth api');

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
): Promise<VerifyOtpResponse> => {
  try {
    const endpoint =
      role === 'mentor' ? '/mentor/register/verify' : '/register/verify';

    const response = await api.post(endpoint, { email, otp });
    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message ?? 'Verification failed',
      };
    }

    return {
      success: false,
      message: 'Unknown error occurred',
    };
  }
};

export const resendOtpApi = async (
  email: string | null,
): Promise<ResendOtpResponse> => {
  try {
    const response = await api.post('/register/resend-otp', { email });
    console.log(response.data, 'response from auth api ');
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data.message;
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('something went wrong');
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

//profile
export const updateProfilePicture = async (
  file: File | null,
  role: Role,
  id?: string,
): Promise<{ message: string; user: User }> => {
  try {
    if (!file) {
      throw new Error('no file selected');
    }
    if (!id) {
      throw new Error('no user id was given ');
    }
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/profile/proPicUpdate/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(response.data, 'from propic api');
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data?.message || 'profile picture updation failed';
    }
    console.error(error);
    if (error instanceof Error) {
      throw error.message;
    }
    throw new Error('Unknown error during profile picture update');
  }
};

export const updateProfile = async (form: ProfileForm, id?: string) => {
  try {
    if (!id) {
      throw new Error('no user id was given');
    }
    const response = await api.post(`/update/profile/${id}`, form);
    console.log(response.data, 'from profle api');
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data?.message || 'profile update failed';
    }
    if (error instanceof Error) {
      throw error.message;
    }
    throw new Error('Unknown error during profile update');
  }
};
