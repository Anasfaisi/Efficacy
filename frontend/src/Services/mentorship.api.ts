import api from './axiosConfig';

export const mentorshipApi = {
    createRequest: async (data: {
        mentorId: string;
        sessions: number;
        proposedStartDate?: Date;
    }) => {
        const response = await api.post('/mentorship/request', data);
        return response.data;
    },

    getMentorRequests: async (
        page: number = 1,
        limit: number = 6,
        status?: string,
        search?: string
    ) => {
        const response = await api.get(
            `/mentorship/requests/mentor?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`
        );
        return response.data;
    },

    getUserRequests: async () => {
        const response = await api.get('/mentorship/requests/user');
        return response.data;
    },

    respondToRequest: async (
        id: string,
        data: {
            status: 'mentor_accepted' | 'rejected';
            suggestedStartDate?: Date;
            reason?: string;
        }
    ) => {
        const response = await api.patch(
            `/mentorship/request/${id}/respond`,
            data
        );
        return response.data;
    },

    confirmSuggestion: async (id: string, confirm: boolean) => {
        const response = await api.patch(
            `/mentorship/request/${id}/confirm`,
            { confirm }
        );
        return response.data;
    },

    verifyPayment: async (id: string, paymentId: string) => {
        const response = await api.post(
            `/mentorship/request/${id}/verify-payment`,
            { paymentId }
        );
        return response.data;
    },

    createMentorshipCheckoutSession: async (
        mentorshipId: string,
        successUrl: string,
        cancelUrl: string
    ) => {
        const response = await api.post(
            `/payments/checkout-mentorship`,
            {
                mentorshipId,
                successUrl,
                cancelUrl,
            }
        );
        console.log(response.data, 'response data mentorship api');
        return response.data;
    },

    getActiveMentorship: async () => {
        const response = await api.get('/mentorship/active');

        return response.data;
    },

    getMentorshipById: async (id: string) => {
        const response = await api.get(`/mentorship/${id}`);
        return response.data;
    },

    bookSession: async (id: string, date: Date, slot: string) => {
        const response = await api.post(
            `/mentorship/${id}/book-session`,
            { date, slot }
        );
        return response.data;
    },

    rescheduleSession: async (
        id: string,
        data: { sessionId: string; newDate: Date; newSlot: string }
    ) => {
        const response = await api.post(
            `/mentorship/${id}/reschedule-session`,
            data
        );
        return response.data;
    },

    completeMentorship: async (id: string, role: 'user' | 'mentor') => {
        const response = await api.post(
            `/mentorship/${id}/complete`,
            { role }
        );
        return response.data;
    },

    submitFeedback: async (
        id: string,
        data: { role: 'user' | 'mentor'; rating: number; comment: string }
    ) => {
        const response = await api.post(
            `/mentorship/${id}/feedback`,
            data
        );
        return response.data;
    },

    cancelMentorship: async (id: string) => {
        const response = await api.post(`/mentorship/${id}/cancel`);
        return response.data;
    },
};
