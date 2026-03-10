import api from './axiosConfig';
import type { MentorApplication, Notification } from '../Features/admin/types';
import type { LoginCredentials, Mentor, User } from '../types/auth';
import type { Transaction } from '@/types/wallet';
import { AdminRoutes } from './constant.routes';

export const adminService = {
    adminLoginApi: async (credentials: LoginCredentials) => {
        const res = await api.post(AdminRoutes.ADMINLOGIN, credentials);
        return res.data;
    },
    getMentorApplications: async (
        page: number = 1,
        limit: number = 10,
        search: string = '',
        filters: { status?: string; mentorType?: string } = {}
    ): Promise<{
        applications: MentorApplication[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }> => {
        const { status = 'all', mentorType = 'all' } = filters;
        const response = await api.get(AdminRoutes.MENTOR_APPLICATIONS, {
            params: {
                page,
                limit,
                search,
                status,
                mentorType,
            },
        });
        return response.data;
    },

    getMentorApplicationById: async (
        applicationId: string
    ): Promise<MentorApplication> => {
        const response = await api.get(
            AdminRoutes.MENTOR_APPLICATION_BY_ID(applicationId)
        );
        return response.data;
    },

    approveMentorApplication: async (applicationId: string): Promise<void> => {
        await api.post(AdminRoutes.MENTOR_APPLICATION_APPROVE(applicationId));
    },

    rejectMentorApplication: async (
        applicationId: string,
        reason: string
    ): Promise<void> => {
        await api.post(AdminRoutes.MENTOR_APPLICATION_REJECT(applicationId), {
            reason,
        });
    },

    requestChangesMentorApplication: async (
        applicationId: string,
        reason: string
    ): Promise<void> => {
        await api.post(
            AdminRoutes.MENTOR_APPLICATIONS_REQUEST_CHANGES(applicationId),
            {
                reason,
            }
        );
    },

    getAllMentors: async (
        page: number = 1,
        limit: number = 10,
        search: string = '',
        filters: { status?: string; mentorType?: string } = {}
    ): Promise<{
        mentors: Mentor[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }> => {
        const { status = 'all', mentorType = 'all' } = filters;
        const response = await api.get(AdminRoutes.MENTORS, {
            params: {
                page,
                limit,
                search,
                status,
                mentorType,
            },
        });
        return response.data;
    },

    getMentorById: async (mentorId: string): Promise<Mentor> => {
        const response = await api.get(AdminRoutes.MENTORS_ID(mentorId));
        return response.data;
    },

    updateMentorStatus: async (
        mentorId: string,
        status: string
    ): Promise<void> => {
        await api.put(AdminRoutes.MENTORS_STATUS(mentorId), { status });
    },

    getAllUsers: async (
        page: number = 1,
        limit: number = 10,
        search: string = ''
    ): Promise<{
        users: User[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }> => {
        const response = await api.get(AdminRoutes.USERS, {
            params: {
                page,
                limit,
                search,
            },
        });
        return response.data;
    },

    updateUserStatus: async (
        userId: string,
        isActive: boolean
    ): Promise<void> => {
        await api.patch(AdminRoutes.USERS_STATUS(userId), { isActive });
    },

    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get(AdminRoutes.NOTIFICATIONS);
        return response.data;
    },

    markNotificationAsRead: async (notificationId: string): Promise<void> => {
        await api.patch(AdminRoutes.NOTIFICATION_MARK_READ(notificationId));
    },

    markAllNotificationsAsRead: async (): Promise<void> => {
        await api.patch(AdminRoutes.NOTIFICATIONS_MARK_ALL_READ);
    },

    getRevenueDetails: async (): Promise<{ totalRevenue: number }> => {
        const response = await api.get(AdminRoutes.REVENUE);
        return response.data;
    },

    getTransactions: async (
        page: number = 1,
        limit: number = 10,
        filter: string = 'all'
    ): Promise<{ transactions: Transaction[]; total: number }> => {
        const response = await api.get(AdminRoutes.TRANSACTIONS, {
            params: {
                page,
                limit,
                filter,
            },
        });
        return response.data;
    },

    getDashboardStats: async (): Promise<{
        totalUsers: number;
        totalMentors: number;
        totalRevenue: number;
    }> => {
        const response = await api.get(AdminRoutes.DASHBOARD_STATS)
        return response.data;
    },
};
