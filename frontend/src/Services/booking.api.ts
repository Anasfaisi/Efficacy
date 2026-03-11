import api from './axiosConfig';
import type {
    Booking,
    CreateBookingRequestDto,
    UpdateBookingStatusRequestDto,
    RescheduleRequestDto,
} from '@/types/booking';
import { BookingRoutes } from './constant.routes';

export const bookingApi = {
    createBooking: async (data: CreateBookingRequestDto): Promise<Booking> => {
        const res = await api.post(BookingRoutes.CREATE_BOOKING, data);
        return res.data;
    },

    getUserBookings: async (
        page: number = 1,
        limit: number = 10,
        status?: string,
        startDate?: string,
        endDate?: string
    ): Promise<{
        bookings: Booking[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }> => {
        const res = await api.get(
            BookingRoutes.USER_SPECIFIC_BOOKING,{
                params:{
                    page,
                    limit,
                    status,
                    startDate,
                    endDate
                }
            }
        );
        return res.data;
    },

    getMentorBookings: async (
        page: number = 1,
        limit: number = 10,
        status?: string,
        startDate?: string,
        endDate?: string
    ): Promise<{
        bookings: Booking[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }> => {
        const res = await api.get(
            BookingRoutes.MENTOR_SPECIFIC_BOOKING,{
                params:{
                    page,
                    limit,
                    status,
                    startDate,
                    endDate
                }
            }
        );
        return res.data;
    },

    updateStatus: async (
        data: UpdateBookingStatusRequestDto
    ): Promise<Booking> => {
        const res = await api.patch(BookingRoutes.UPDATE_BOOKING_STATUS, data);
        return res.data;
    },

    requestReschedule: async (data: RescheduleRequestDto): Promise<Booking> => {
        const res = await api.post(BookingRoutes.REQUEST_RESCHEDULE, data);
        return res.data;
    },

    respondToReschedule: async (
        bookingId: string,
        approve: boolean
    ): Promise<Booking> => {
        const res = await api.post(BookingRoutes.RESPOND_TO_RESCHEDULE, {
            bookingId,
            approve,
        });
        return res.data;
    },

    verifyAccess: async (bookingId: string): Promise<{ success: boolean }> => {
        const res = await api.get(BookingRoutes.VERIFY_ACCESS(bookingId));
        return res.data;
    },

    getBookingById: async (bookingId: string): Promise<Booking> => {
        const res = await api.get(BookingRoutes.GET_BOOKING_BY_ID(bookingId));
        console.log(res,"res")
        return res.data;
    },

    startSession: async (bookingId: string): Promise<Booking> => {
        const res = await api.post(BookingRoutes.START_SESSION(bookingId));
        return res.data;
    },

    endSession: async (bookingId: string): Promise<Booking> => {
        const res = await api.post(BookingRoutes.END_SESSION(bookingId));
        return res.data;
    },
};
