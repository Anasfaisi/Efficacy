import axiosInstance from './axiosConfig';

export const mentorshipApi = {
    createRequest: async (data: {
        mentorId: string;
        sessions: number;
        proposedStartDate?: Date;
    }) => {
        const response = await axiosInstance.post('/mentorship/request', data);
        return response.data;
    },

    getMentorRequests: async () => {
        const response = await axiosInstance.get('/mentorship/requests/mentor');
        return response.data;
    },

    getUserRequests: async () => {
        const response = await axiosInstance.get('/mentorship/requests/user');
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
        const response = await axiosInstance.patch(
            `/mentorship/request/${id}/respond`,
            data
        );
        return response.data;
    },

    confirmSuggestion: async (id: string, confirm: boolean) => {
        const response = await axiosInstance.patch(
            `/mentorship/request/${id}/confirm`,
            { confirm }
        );
        return response.data;
    },

    verifyPayment: async (id: string, paymentId: string) => {
        const response = await axiosInstance.post(
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
        const response = await axiosInstance.post(
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
        const response = await axiosInstance.get('/mentorship/active');

        return response.data;
    },

    getMentorshipById: async (id: string) => {
        const response = await axiosInstance.get(`/mentorship/${id}`);
        return response.data;
    },

    bookSession: async (id: string, date: Date) => {
        const response = await axiosInstance.post(
            `/mentorship/${id}/book-session`,
            { date }
        );
        return response.data;
    },

    rescheduleSession: async (
        id: string,
        data: { sessionId: string; newDate: Date }
    ) => {
        const response = await axiosInstance.post(
            `/mentorship/${id}/reschedule-session`,
            data
        );
        return response.data;
    },

    completeMentorship: async (id: string, role: 'user' | 'mentor') => {
        const response = await axiosInstance.post(
            `/mentorship/${id}/complete`,
            { role }
        );
        return response.data;
    },

    submitFeedback: async (
        id: string,
        data: { role: 'user' | 'mentor'; rating: number; comment: string }
    ) => {
        const response = await axiosInstance.post(
            `/mentorship/${id}/feedback`,
            data
        );
        return response.data;
    },

    cancelMentorship: async (id: string) => {
        const response = await axiosInstance.post(`/mentorship/${id}/cancel`);
        return response.data;
    },
};
