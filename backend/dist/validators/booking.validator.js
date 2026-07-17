"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleRequestSchema = exports.createBookingSchema = exports.rescheduleDateValidator = exports.DateValidator = exports.createBookingDateValidator = void 0;
const zod_1 = require("zod");
const response_messages_types_1 = require("@/types/response-messages.types");
exports.createBookingDateValidator = zod_1.z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}, {
    message: response_messages_types_1.ErrorMessages.PastDateBooking,
});
exports.DateValidator = exports.createBookingDateValidator;
exports.rescheduleDateValidator = zod_1.z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}, {
    message: response_messages_types_1.ErrorMessages.PastDateReschedule,
});
exports.createBookingSchema = zod_1.z.object({
    mentorId: zod_1.z.string().min(1, 'Mentor ID is required'),
    bookingDate: exports.createBookingDateValidator,
    slot: zod_1.z.string().min(1, 'Slot is required'),
    topic: zod_1.z.string().optional(),
});
exports.rescheduleRequestSchema = zod_1.z.object({
    bookingId: zod_1.z.string().min(1, 'Booking ID is required'),
    proposedDate: exports.rescheduleDateValidator,
    proposedSlot: zod_1.z.string().min(1, 'Proposed slot is required'),
    requestedBy: zod_1.z.enum(['user', 'mentor']),
});
//# sourceMappingURL=booking.validator.js.map