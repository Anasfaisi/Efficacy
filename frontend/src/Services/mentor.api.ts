import api from './axiosConfig';
import type { mentorFormSchemaType } from '@/types/zodSchemas';
import type { Mentor } from '@/types/auth';
import type { Notification } from '@/Features/admin/types';
import { MentorRoutes } from './constant.routes';
import type { price } from '@/types/mentor';

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
        }
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

        const res = await api.post(
            MentorRoutes.MENTOR_APPLICATION_INIT,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        return {
            status: res.data.result?.status || 'pending',
            result: res.data.result,
        };
    },
    activateMentor: async (monthlyCharge: number) => {
        const res = await api.post(MentorRoutes.ACTIVATE_MENTOR, {
            monthlyCharge,
        });
        return res.data;
    },

    getMentorProfile: async (): Promise<Mentor> => {
        const res = await api.get(MentorRoutes.MENTOR_PROFILE);
        return res.data.mentor;
    },
    getApprovedMentors: async (
        page: number = 1,
        limit: number = 10,
        search: string = '',
        sort: string = '',
        filters: Record<string, price> = {}
    ): Promise<{ mentors: Mentor[]; total: number; pages: number }> => {
        const params = { page, limit, search, sort, ...filters };
        const res = await api.get(MentorRoutes.APPROVED_MENTORS_LIST, {
            params,
        });
        return res.data;
    },

    getMentorById: async (mentorId: string): Promise<Mentor> => {
        const res = await api.get(MentorRoutes.FETCH_MENTOR(mentorId));
        return res.data.mentor;
    },

    verifyOtp: async (data: { email: string; otp: string; role: string }) => {
        const res = await api.post(MentorRoutes.VERIFY_OTP, data);
        return res.data;
    },
    resendOtp: async (email: string) => {
        const res = await api.post(MentorRoutes.MENTOR_RESEND_OTP, { email });
        return res.data;
    },
    forgotPassword: async (email: string) => {
        const res = await api.post(MentorRoutes.MENTOR_FORGOT_PASSWORD, {
            email,
        });
        return res.data;
    },
    resetPassword: async (token: string, newPassword: string) => {
        const res = await api.post(MentorRoutes.MENTOR_RESET_PASSWORD, {
            token,
            newPassword,
        });
        return res.data;
    },
    getNotifications: async (): Promise<Notification[]> => {
        const res = await api.get(MentorRoutes.MENTOR_NOTIFICATIONS);
        return res.data;
    },
    markNotificationAsRead: async (notificationId: string): Promise<void> => {
        await api.patch(
            MentorRoutes.MENTOR_MARK_NOTIFICATION_AS_READ(notificationId)
        );
    },
    markAllNotificationsAsRead: async (): Promise<void> => {
        await api.patch(MentorRoutes.MENTOR_MARK_ALL_NOTIFICATION_AS_READ);
    },

    updateMentorProfileBasicInfo: async (data: Partial<Mentor>) => {
        const res = await api.patch(
            MentorRoutes.BASIC_MENTOR_PROFILE_BASIC,
            data
        );
        return res.data;
    },

    updateMentorProfileMedia: async (files: {
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
        if (files.certificate)
            formData.append('certificate', files.certificate);
        if (files.idProof) formData.append('idProof', files.idProof);
        const res = await api.patch(
            MentorRoutes.MEDIA_MENTOR_PROFILE_MEDIA,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return res.data;
    },

    updateMentorProfileArray: async (field: string, elements: unknown[]) => {
        const formData = new FormData();
        formData.append('field', field);
        formData.append('data', JSON.stringify(elements));

        const res = await api.patch(
            MentorRoutes.ARRAY_MENTOR_PROFILE_ARRAY,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return res.data;
    },
};
