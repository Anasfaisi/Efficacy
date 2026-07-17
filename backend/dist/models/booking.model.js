"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const booking_status_types_1 = require("@/types/booking-status.types");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Users', required: true },
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mentors',
        required: true,
    },
    bookingDate: { type: Date, required: true },
    slot: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(booking_status_types_1.BookingStatus),
        default: booking_status_types_1.BookingStatus.PENDING,
    },
    duration: { type: Number, default: 60 },
    topic: { type: String },
    rescheduleBy: {
        type: String,
        enum: ['user', 'mentor', null],
        default: null,
    },
    proposedDate: { type: Date },
    proposedSlot: { type: String },
    meetingLink: { type: String },
    cancelReason: { type: String },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
}, { timestamps: true });
bookingSchema.index({ mentorId: 1, bookingDate: 1, slot: 1 }, {
    unique: true,
    partialFilterExpression: { status: { $ne: booking_status_types_1.BookingStatus.CANCELLED } },
});
exports.default = (0, mongoose_1.model)('Booking', bookingSchema);
//# sourceMappingURL=booking.model.js.map