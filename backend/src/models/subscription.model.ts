import { Schema, model, Document } from 'mongoose';
import { IPlan } from './Plan.model';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    CANCELLED = 'cancelled',
}

export interface ISubscription extends Document {
    planId: Schema.Types.ObjectId | IPlan;
    status: SubscriptionStatus;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
    sessionsBookedThisMonth: number;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        planId: { type: Schema.Types.ObjectId, ref: 'Plan' },
        status: {
            type: String,
            enum: Object.values(SubscriptionStatus),
            default: SubscriptionStatus.INACTIVE,
        },
        stripeSubscriptionId: { type: String },
        currentPeriodEnd: { type: Date },
        sessionsBookedThisMonth: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default model<ISubscription>('Subscriptions', subscriptionSchema);
