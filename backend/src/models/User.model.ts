import { Schema, model, Document, ObjectId } from 'mongoose';
interface ISubscription {
    id?: string;
    status?: string;
    priceId?: string;
    current_period_end?: Date;
}
interface IUser extends Document<ObjectId> {
    name: string;
    email: string;
    password: string;
    role: string;
    stripeCustomerId?: string;
    subscription?: ISubscription;
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

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user'], default: 'user' },
    stripeCustomerId: { type: String },
    subscription: { type: subscriptionSchema, default: {} },
});

export { IUser, ISubscription };
export default model<IUser>('Users', userSchema);
