import api from './axiosConfig';
import type {
    Booking,
    CreateBookingRequestDto,
    UpdateBookingStatusRequestDto,
    RescheduleRequestDto
} from '@/types/booking';

export const bookingApi = {
    createBooking: async (data: CreateBookingRequestDto): Promise<Booking> => {
        const res = await api.post('/booking', data);
        return res.data;
    },

    getUserBookings: async (): Promise<Booking[]> => {
        const res = await api.get('/booking/user');
        return res.data;
    },

    getMentorBookings: async (
        page: number = 1,
        limit: number = 10,
        status?: string
    ): Promise<{ bookings: Booking[]; totalCount: number; totalPages: number; currentPage: number }> => {
        const res = await api.get(
            `/booking/mentor?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`
        );
        return res.data;
    },

    updateStatus: async (data: UpdateBookingStatusRequestDto): Promise<Booking> => {
        const res = await api.patch('/booking/status', data);
        return res.data;
    },

    requestReschedule: async (data: RescheduleRequestDto): Promise<Booking> => {
        const res = await api.post('/booking/reschedule-request', data);
        return res.data;
    },

    respondToReschedule: async (bookingId: string, approve: boolean): Promise<Booking> => {
        const res = await api.post('/booking/reschedule-respond', { bookingId, approve });
        return res.data;
    }
};
