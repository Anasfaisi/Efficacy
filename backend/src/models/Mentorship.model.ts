import { Schema, model, Document, ObjectId } from 'mongoose';

export enum MentorshipStatus {
    PENDING = 'pending',
    MENTOR_ACCEPTED = 'mentor_accepted',
    USER_CONFIRMED = 'user_confirmed', // When user accepts mentor's suggested date
    PAYMENT_PENDING = 'payment_pending',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

export enum SessionStatus {
    PENDING = 'pending',
    BOOKED = 'booked',
    COMPLETED = 'completed',
    RESCHEDULE_REQUESTED = 'reschedule_requested',
    CANCELLED = 'cancelled',
}

interface ISession {
    _id?: string | ObjectId;
    date: Date;
    slot?: string;
    status: SessionStatus;
    mentorNotes?: string;
    userNotes?: string;
    meetingLink?: string;
}

interface IMentorship extends Document {
    userId: string | ObjectId;
    mentorId: string | ObjectId;
    status: MentorshipStatus;
    startDate?: Date;
    endDate?: Date;
    proposedStartDate?: Date;
    mentorSuggestedStartDate?: Date;

    totalSessions: number;
    usedSessions: number;
    sessions: ISession[];

    paymentStatus: 'pending' | 'paid' | 'verified';
    paymentId?: string;
    amount: number;

    userFeedback?: {
        rating: number;
        comment: string;
    };
    mentorFeedback?: {
        rating: number;
        comment: string;
    };

    userConfirmedCompletion: boolean;
    mentorConfirmedCompletion: boolean;

    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema<ISession>({
    date: { type: Date, required: true },
    slot: { type: String }, // Specific hourly slot
    status: {
        type: String,
        enum: Object.values(SessionStatus),
        default: SessionStatus.PENDING,
    },
    mentorNotes: { type: String },
    userNotes: { type: String },
    meetingLink: { type: String },
});

const mentorshipSchema = new Schema<IMentorship>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        mentorId: {
            type: Schema.Types.ObjectId,
            ref: 'Mentors',
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(MentorshipStatus),
            default: MentorshipStatus.PENDING,
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
            enum: ['pending', 'paid', 'verified'],
            default: 'pending',
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
    },
    { timestamps: true }
);

export { IMentorship, ISession };
export default model<IMentorship>('Mentorships', mentorshipSchema);
