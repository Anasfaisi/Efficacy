import { Schema, model } from 'mongoose';

export interface ISubscription {
    id?: string;
    status?: string;
    priceId?: string;
    current_period_end?: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        id: { type: String },
        status: { type: String },
        priceId: { type: String },
        current_period_end: { type: Date },
    },
    { _id: false }
);

export default model<ISubscription>('Subscriptions', subscriptionSchema);
