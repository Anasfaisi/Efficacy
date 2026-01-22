import api from './axiosConfig';
import type { mentorFormSchemaType } from '@/types/zodSchemas';
import type { Mentor } from '@/types/auth';
import type { Notification } from '@/Features/admin/types';

export interface MentorApplicationResult {
    status: string;
    result?: unknown;
}

export const mentorApi = {
    submitApplication: async (
        data: mentorFormSchemaType,
        files: {
            certificate: File | null;
            resume: File | null;
            idProof: File | null;
        },
    ): Promise<MentorApplicationResult> => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob);
            }
        });

        if (files.resume) formData.append('resume', files.resume);
        if (files.certificate)
            formData.append('certificate', files.certificate);
        if (files.idProof) formData.append('idProof', files.idProof);
        for (const [key, value] of formData) {
            console.log(key, value, 'form data');
        }

        const res = await api.post('/mentor/application/init', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return {
            status: res.data.result?.status || 'pending',
            result: res.data.result,
        };
    },
    activateMentor: async (monthlyCharge: number) => {
        const res = await api.post('/mentor/activate', { monthlyCharge });
        return res.data;
    },
    getMentorProfile: async (): Promise<Mentor> => {
        const res = await api.get('/mentor/profile');
        return res.data.mentor;
    },
    getApprovedMentors: async (
        page: number = 1,
        limit: number = 10,
        search: string = '',
        sort: string = '',
        filters: Record<string, any> = {},
    ): Promise<{ mentors: Mentor[]; total: number; pages: number }> => {
        const params = { page, limit, search, sort, ...filters };
        const res = await api.get('/mentor/list/approved', { params });
        console.log(res.data, 'approved mentors');
        return res.data;
    },
    verifyOtp: async (data: { email: string; otp: string; role: string }) => {
        const res = await api.post('/mentor/register/verify', data);
        return res.data;
    },
    resendOtp: async (email: string) => {
        const res = await api.post('/mentor/resend-otp', { email });
        return res.data;
    },
    forgotPassword: async (email: string) => {
        const res = await api.post('/mentor/forgot-password', { email });
        console.log(res.data, 'forgot password');
        return res.data;
    },
    resetPassword: async (token: string, newPassword: string) => {
        const res = await api.post('/mentor/reset-password', {
            token,
            newPassword,
        });
        return res.data;
    },
    getNotifications: async (): Promise<Notification[]> => {
        const res = await api.get('/mentor/notifications');
        return res.data;
    },
    markNotificationAsRead: async (id: string): Promise<void> => {
        await api.patch(`/mentor/notifications/${id}/mark-read`);
    },
    markAllNotificationsAsRead: async (): Promise<void> => {
        await api.patch('/mentor/notifications/mark-all-read');
    },
};

export const updateMentorProfileBasicInfo = async (data: Partial<Mentor>) => {
    const res = await api.patch('/mentor/profile/basic-info', data);
    return res.data;
};

export const updateMentorProfileMedia = async (files: {
    profilePic: File | null;
    coverPic: File | null;
    resume: File | null;
    certificate: File | null;
    idProof: File | null;
}) => {
    const formData = new FormData();
    if (files.profilePic) formData.append('profilePic', files.profilePic);
    if (files.coverPic) formData.append('coverPic', files.coverPic);
    if (files.resume) formData.append('resume', files.resume);
    if (files.certificate) formData.append('certificate', files.certificate);
    if (files.idProof) formData.append('idProof', files.idProof);
    const res = await api.patch('/mentor/profile/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const updateMentorProfileArray = async (
    field: string,
    elements: unknown[],
) => {
    const formData = new FormData();
    formData.append('field', field);
    formData.append('data', JSON.stringify(elements));

    const res = await api.patch('/mentor/profile/array-update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};
