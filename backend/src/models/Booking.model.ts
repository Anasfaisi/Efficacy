import { Schema, model, Document, Types } from 'mongoose';
import { BookingStatus } from '@/types/booking-status.types';

export interface IBooking extends Document {
    userId: Types.ObjectId;
    mentorId: Types.ObjectId;
    bookingDate: Date;
    slot: string;
    status: BookingStatus;
    duration: number;
    topic?: string;
    rescheduleBy?: 'user' | 'mentor' | null;
    proposedDate?: Date;
    proposedSlot?: string;
    meetingLink?: string;
    cancelReason?: string;
    actualStartTime?: Date;
    actualEndTime?: Date;
    sessionMinutes?: number;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        mentorId: {
            type: Schema.Types.ObjectId,
            ref: 'Mentors',
            required: true,
        },
        bookingDate: { type: Date, required: true },
        slot: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.PENDING,
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
        sessionMinutes: { type: Number },
    },
    { timestamps: true }
);

bookingSchema.index({ mentorId: 1, bookingDate: 1, slot: 1 }, { unique: true });

export default model<IBooking>('Booking', bookingSchema);
