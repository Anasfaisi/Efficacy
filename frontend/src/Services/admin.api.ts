import api from './axiosConfig';
import type { MentorApplication, Notification } from '../Features/admin/types';
import type { LoginCredentials, Mentor, User } from '../types/auth';

export const adminService = {
    adminLoginApi: async (credentials: LoginCredentials) => {
        const res = await api.post('/admin/login', credentials);
        return res.data;
    },
    // Mentor Application Review
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
        const response = await api.get(
            `/admin/mentors/applications?page=${page}&limit=${limit}&search=${search}&status=${status}&mentorType=${mentorType}`
        );
        return response.data;
    },

    getMentorApplicationById: async (
        id: string
    ): Promise<MentorApplication> => {
        const response = await api.get(`/admin/mentors/applications/${id}`);
        return response.data;
    },

    approveMentorApplication: async (id: string): Promise<void> => {
        await api.post(`/admin/mentors/applications/${id}/approve`);
    },

    rejectMentorApplication: async (
        id: string,
        reason: string
    ): Promise<void> => {
        await api.post(`/admin/mentors/applications/${id}/reject`, { reason });
    },

    requestChangesMentorApplication: async (
        id: string,
        reason: string
    ): Promise<void> => {
        await api.post(`/admin/mentors/applications/${id}/request-changes`, {
            reason,
        });
    },

    // Mentor Management
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
        const response = await api.get(
            `/admin/mentors?page=${page}&limit=${limit}&search=${search}&status=${status}&mentorType=${mentorType}`
        );
        return response.data;
    },

    getMentorById: async (id: string): Promise<Mentor> => {
        const response = await api.get(`/admin/mentors/${id}`);
        return response.data;
    },

    updateMentorStatus: async (id: string, status: string): Promise<void> => {
        await api.put(`/admin/mentors/${id}/status`, { status });
    },

    //User Management
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
        const response = await api.get(
            `/admin/users?page=${page}&limit=${limit}&search=${search}`
        );
        return response.data;
    },

    updateUserStatus: async (id: string, isActive: boolean): Promise<void> => {
        await api.patch(`/admin/users/${id}/status`, { isActive });
    },

    //Notification
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/admin/notifications');
        return response.data;
    },

    markNotificationAsRead: async (id: string): Promise<void> => {
        const result = await api.patch(`/admin/notifications/${id}/mark-read`);
        console.log(result);
    },

    markAllNotificationsAsRead: async (): Promise<void> => {
        await api.patch('/admin/notifications/mark-all-read');
    },

    getRevenueDetails: async (): Promise<{ totalRevenue: number }> => {
        const response = await api.get('/admin/revenue');
        return response.data;
    },

    getTransactions: async (
        page: number = 1,
        limit: number = 10,
        filter: string = 'all'
    ): Promise<{ transactions: any[]; total: number }> => {
        const response = await api.get(
            `/admin/transactions?page=${page}&limit=${limit}&filter=${filter}`
        );
        return response.data;
    },
};
