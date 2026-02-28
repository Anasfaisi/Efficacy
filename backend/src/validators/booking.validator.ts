import { z } from 'zod';
import { ErrorMessages } from '@/types/response-messages.types';

export const createBookingDateValidator = z.string().refine(
    (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    },
    {
        message: ErrorMessages.PastDateBooking,
    }
);

export const DateValidator = createBookingDateValidator;

export const rescheduleDateValidator = z.string().refine(
    (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    },
    {
        message: ErrorMessages.PastDateReschedule,
    }
);

export const createBookingSchema = z.object({
    mentorId: z.string().min(1, 'Mentor ID is required'),
    bookingDate: createBookingDateValidator,
    slot: z.string().min(1, 'Slot is required'),
    topic: z.string().optional(),
});

export const rescheduleRequestSchema = z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
    proposedDate: rescheduleDateValidator,
    proposedSlot: z.string().min(1, 'Proposed slot is required'),
    requestedBy: z.enum(['user', 'mentor']),
});
