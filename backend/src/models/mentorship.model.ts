import { MentorshipStatus, SessionStatus } from '@/types/mentorship.types';
import { PaymentStatus } from '@/types/payment.types';
import { Schema, model, Document, Types } from 'mongoose';

interface ISession {
    _id?: string | Types.ObjectId;
    date: Date;
    slot?: string;
    status: SessionStatus;
    mentorNotes?: string;
    userNotes?: string;
    meetingLink?: string;
}

interface IMentorship extends Document {
    userId: Types.ObjectId;
    mentorId: Types.ObjectId;
    status: MentorshipStatus;
    startDate?: Date;
    endDate?: Date;
    proposedStartDate?: Date;
    mentorSuggestedStartDate?: Date;

    totalSessions: number;
    usedSessions: number;
    sessions?: ISession[];

    paymentStatus: PaymentStatus;
    paymentId: string;
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
    completionInitiatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema<ISession>({
    date: { type: Date, required: true },
    slot: { type: String },
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
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
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
    },
    { timestamps: true }
);

export { IMentorship, ISession };
export default model<IMentorship>('Mentorships', mentorshipSchema);
