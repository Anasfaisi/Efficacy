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
import type { Notification } from '@/Features/admin/types';
import { UserRoutes } from './constant.routes';

export const fetchCurrentUser = async (userId: string): Promise<User> => {
    const res = await api.get(UserRoutes.FETCH_CURRENT_USER(userId));
    return res.data.user as User;
};

export const loginApi = async (
    credentials: LoginCredentials
): Promise<LoginResponse> => {
    const res = await api.post(UserRoutes.LOGIN, credentials);
    return res.data;
};

export const logoutApi = async (): Promise<{ message: string }> => {
    const response = await api.post(UserRoutes.LOGOUT);
    return response.data;
};

export const registerInitApi = async (
    credentials: RegisterCredentials
): Promise<{
    tempEmail: string;
    message: string;
    role: string;
    resendAvailableAt: string;
}> => {
    const response = await api.post(UserRoutes.REGISTER, credentials);
    return response.data;
};

export const verifyOtpApi = async (
    email: string | null,
    otp: string,
    role: string | null
): Promise<VerifyOtpResponse> => {
    try {
        const response = await api.post(UserRoutes.VERIFY_OTP, { email, otp });
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
    email: string | null
): Promise<ResendOtpResponse> => {
    try {
        const response = await api.post(UserRoutes.RESEND_OTP, { email });
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
    email: string
): Promise<{ message: string }> => {
    try {
        const response = await api.post(UserRoutes.FORGET_PASSWORD, { email });
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
    newPassword: string
): Promise<{ message: string }> => {
    try {
        const response = await api.post(UserRoutes.RESET_PASSWORD, {
            token,
            newPassword,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw (
                error.response?.data?.message ||
                AuthMessages.ResetPasswordFailed
            );
        }
        throw error;
    }
};

export const googleLoginApi = async (
    googleToken: string,
    role: 'user' | 'mentor'
): Promise<{ user: User }> => {
    try {
        const endpoint =
            role === 'mentor' ? '/mentor/google-login' : '/google-login';
        const res = await api.post(endpoint, { googleToken, role });
        console.log(res, 'res');
        return res.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw (
                error.response?.data?.message ||
                AuthMessages.ResetPasswordFailed
            );
        }
        throw error;
    }
};

export const updateProfilePicture = async (
    file: File | null,
    id?: string
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
        const response = await api.patch(
            UserRoutes.UPDATE_PROFILE_PICTURE(id),
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw (
                error.response?.data?.message ||
                'profile picture updation failed'
            );
        }
        console.error(error);
        if (error instanceof Error) {
            throw error.message;
        }
        throw new Error('Unknown error during profile picture update');
    }
};

export const updateProfile = async (form: ProfileForm, userId: string) => {
    const response = await api.patch(
        UserRoutes.UPDATE_PROFILE_BASIC(userId),
        form
    );
    return response;
};

export const getNotifications = async (): Promise<Notification[]> => {
    const res = await api.get(UserRoutes.NOTIFICATIONS);
    return res.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
    await api.patch(UserRoutes.MARK_NOTIFICATION_AS_READ(id));
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await api.patch(UserRoutes.MARK_ALL_NOTIFICATIONS_AS_READ);
};
