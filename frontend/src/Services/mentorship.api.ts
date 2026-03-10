import api from './axiosConfig';
import { MentorshipRoutes } from './constant.routes';

export const mentorshipApi = {
    createRequest: async (data: {
        mentorId: string;
        sessions: number;
        proposedStartDate?: Date;
    }) => {
        const response = await api.post(MentorshipRoutes.CREATE_REQUEST, data);
        return response.data;
    },

    getMentorRequests: async (
        page: number = 1,
        limit: number = 6,
        status?: string,
        search?: string
    ) => {
        const response = await api.get(
            `${MentorshipRoutes.GET_MENTOR_REQUESTS}?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`
        );
        return response.data;
    },

    getUserRequests: async () => {
        const response = await api.get(MentorshipRoutes.GET_USER_REQUESTS);
        return response.data;
    },

    respondToRequest: async (
        requestId: string,
        data: {
            status: 'mentor_accepted' | 'rejected';
            suggestedStartDate?: Date;
            reason?: string;
        }
    ) => {
        const response = await api.patch(
            MentorshipRoutes.RESPOND_TO_REQUEST(requestId),
            data
        );
        return response.data;
    },

    confirmSuggestion: async (requestId: string, confirm: boolean) => {
        const response = await api.patch(
            MentorshipRoutes.CONFIRM_SUGGESTION(requestId),
            {
                confirm,
            }
        );
        return response.data;
    },

    verifyPayment: async (requestId: string, paymentId: string) => {
        const response = await api.post(
            MentorshipRoutes.VERIFY_PAYMENT(requestId),
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
            MentorshipRoutes.CREATE_CHECKOUT_SESSION,
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
        const response = await api.get(MentorshipRoutes.GET_ACTIVE_MENTORSHIP);

        return response.data;
    },

    getMentorshipById: async (mentorshipId: string) => {
        const response = await api.get(
            MentorshipRoutes.GET_MENTORSHIP_DETAIL(mentorshipId)
        );
        return response.data;
    },

    bookSession: async (mentorshipId: string, date: Date, slot: string) => {
        const response = await api.post(
            MentorshipRoutes.BOOK_SESSION(mentorshipId),
            {
                date,
                slot,
            }
        );
        return response.data;
    },

    rescheduleSession: async (
        mentorshipId: string,
        data: { sessionId: string; newDate: Date; newSlot: string }
    ) => {
        const response = await api.post(
            MentorshipRoutes.RESCHEDULE_SESSION(mentorshipId),
            data
        );
        return response.data;
    },

    completeMentorship: async (
        mentorshipId: string,
        role: 'user' | 'mentor'
    ) => {
        const response = await api.post(
            MentorshipRoutes.COMPLETE_MENTORSHIP(mentorshipId),
            { role }
        );
        return response.data;
    },

    updateUsedSession: async (mentorshipId: string) => {
        const response = await api.patch(
            MentorshipRoutes.GET_MENTORSHIP_DETAIL(mentorshipId)
        );
        return response.data;
    },

    submitFeedback: async (
        mentorshipId: string,
        data: { role: 'user' | 'mentor'; rating: number; comment: string }
    ) => {
        const response = await api.post(
            MentorshipRoutes.SUBMIT_FEEDBACK(mentorshipId),
            data
        );
        return response.data;
    },

    cancelMentorship: async (mentorshipId: string) => {
        const response = await api.post(
            MentorshipRoutes.CANCEL_MENTORSHIP(mentorshipId)
        );
        return response.data;
    },
};
