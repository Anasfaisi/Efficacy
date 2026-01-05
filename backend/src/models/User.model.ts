import { Role } from '@/types/role.types';
import { Schema, model, Document, ObjectId } from 'mongoose';
import { ISubscription } from './subscription.model';
import subscriptionSchema from './subscription.model';

interface IUser extends Document<ObjectId> {
    name: string;
    userId?: string;
    email: string;
    password: string;
    role: Role;

    bio?: string;
    headline?: string;
    profilePic?: string;
    dob?: string;

    stripeCustomerId?: string;
    subscription?: ISubscription;
    walletBalance?: number;
    walletCurrency?: string;

    xpPoints?: number;
    badge?: string;
    league?: string;

    currentStreak?: number;
    longestStreak?: number;
    lastActiveDate?: Date | null;

    timezone?: string;
    profileCompletion?: number;
}

const userSchema = new Schema<IUser>(
    {
        userId: { type: String },
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: Object.values(Role), default: Role.User },

        bio: { type: String },
        headline: { type: String },
        profilePic: { type: String },
        dob: { type: String },

        stripeCustomerId: { type: String },
        subscription: {
            type: Schema.Types.ObjectId,
            ref: 'Subscriptions',
        },
        walletBalance: { type: Number, default: 0 },
        walletCurrency: { type: String, default: 'INR' },

        xpPoints: { type: Number, default: 0 },
        badge: { type: Array, default: [] },
        league: { type: String, default: 'Beginner' },

        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastActiveDate: { type: Date },

        timezone: { type: String, default: 'UTC' },
        profileCompletion: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export { IUser };
export default model<IUser>('Users', userSchema);
