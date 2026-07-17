"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mentorship_types_1 = require("@/types/mentorship.types");
const payment_types_1 = require("@/types/payment.types");
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    slot: { type: String },
    status: {
        type: String,
        enum: Object.values(mentorship_types_1.SessionStatus),
        default: mentorship_types_1.SessionStatus.PENDING,
    },
    mentorNotes: { type: String },
    userNotes: { type: String },
    meetingLink: { type: String },
});
const mentorshipSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Users', required: true },
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mentors',
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(mentorship_types_1.MentorshipStatus),
        default: mentorship_types_1.MentorshipStatus.PENDING,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    proposedStartDate: { type: Date },
    mentorSuggestedStartDate: { type: Date },
    totalSessions: { type: Number, required: true, min: 7, max: 10 },
    usedSessions: { type: Number, default: 0 },
    sessions: [sessionSchema],
    paymentStatus: {
        type: String,
        enum: Object.values(payment_types_1.PaymentStatus),
        default: payment_types_1.PaymentStatus.PENDING,
    },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    userFeedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
    },
    mentorFeedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
    },
    userConfirmedCompletion: { type: Boolean, default: false },
    mentorConfirmedCompletion: { type: Boolean, default: false },
    rejectionReason: { type: String },
    completionInitiatedAt: { type: Date, default: undefined },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Mentorships', mentorshipSchema);
//# sourceMappingURL=mentorship.model.js.map