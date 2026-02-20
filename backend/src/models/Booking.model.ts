import { Schema, model, Document, ObjectId } from 'mongoose';

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    RESCHEDULED = 'rescheduled',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

export interface IBooking extends Document {
    userId: ObjectId;
    mentorId: ObjectId;
    bookingDate: Date;
    slot: string; 
    status: BookingStatus;
    duration: number;
    topic?: string;
    rescheduleBy?: 'user' | 'mentor' | null;
    proposedDate?: Date;
    proposedSlot?: string; 
    meetingLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        mentorId: { type: Schema.Types.ObjectId, ref: 'Mentors', required: true },
        bookingDate: { type: Date, required: true },
        slot: { type: String, required: true },
        status: { 
            type: String, 
            enum: Object.values(BookingStatus), 
            default: BookingStatus.PENDING 
        },
        duration: { type: Number, default: 60 },
        topic: { type: String },
        rescheduleBy: { type: String, enum: ['user', 'mentor', null], default: null },
        proposedDate: { type: Date },
        proposedSlot: { type: String },
        meetingLink: { type: String }
    },
    { timestamps: true }
);

bookingSchema.index({ mentorId: 1, bookingDate: 1, slot: 1 }, { unique: true });

export default model<IBooking>('Booking', bookingSchema);
