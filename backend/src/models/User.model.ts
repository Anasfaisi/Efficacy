import { Role } from '@/types/role.types';
import { Schema, model, Document, ObjectId } from 'mongoose';
import { ISubscription } from './subscription.model';
import subscriptionSchema from './subscription.model';

interface IUser extends Document<ObjectId> {
    userId?: string;
    name: string;
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
    // WalletTransaction?:IWalletTransaction;

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
        userId: { type: String, required: true, unique: true }, 
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

// import { Document, ObjectId } from 'mongoose';

// export type Role = 'learner' | 'mentor' | 'admin';

// export interface ISubscription {
//   planId?: string;
//   planName?: string;
//   amount?: number; // in smallest currency unit or float
//   minutesGranted?: number; // minutes credited when purchased
//   minutesRemaining?: number; // mirror of wallet? optional
//   expiresAt?: Date | null;
//   autoRenew?: boolean;
//   status?: 'active' | 'paused' | 'cancelled' | 'expired';
//   nextBillingDate?: Date | null;
// }

// export interface IWalletTransaction {
//   _id?: ObjectId;
//   type: 'credit' | 'debit' | 'bonus' | 'refund' | 'adjustment';
//   amount: number; // currency amount
//   minutes?: number; // optional minutes equivalent
//   currency?: string; // 'INR' etc.
//   reference?: string; // sessionId, subscriptionId, admin note
//   createdAt?: Date;
// }

// export interface IFocusSession {
//   _id?: ObjectId;
//   sessionId?: string; // unique id used in realtime
//   mode?: 'pomodoro' | 'stopwatch' | 'manual' | 'mentor';
//   taskId?: ObjectId | string | null; // optional association
//   startTime: Date;
//   endTime?: Date | null;
//   activeSeconds?: number; // server-validated active seconds
//   assignedMinutes?: number | null; // if user assigned estimate
//   pausedCount?: number;
//   isVerified?: boolean; // for manual sessions that user confirmed
//   integrityScore?: number; // optional per-session integrity
//   status?: 'running' | 'completed' | 'cancelled' | 'pending_review';
//   createdAt?: Date;
// }

// export interface IUserBadge {
//   badgeId: string;
//   name: string;
//   description?: string;
//   awardedAt?: Date;
//   meta?: Record<string, any>;
// }

// export interface IUser extends Document<ObjectId> {
//   name: string;
//   email: string;
//   password: string;
//   role: Role;
//   bio?: string;
//   headline?: string;
//   profilePicture?: string;
//   dob?: string;
//   stripeCustomerId?: string;

//   // SUBSCRIPTION / WALLET
//   subscription?: ISubscription;
//   walletBalance?: number; // currency
//   walletCurrency?: string; // e.g. 'INR'
//   walletTransactions?: IWalletTransaction[]; // optionally keep small history in user doc

//   // GAMIFICATION
//   xpPoints: number;               // total xp
//   badges: IUserBadge[];           // list of badges
//   level?: number;                 // derived from xp but stored for convenience
//   league?: string;                // 'Beginner' | 'Focused' | 'Pro' | 'Elite'
//   trustScore?: number;            // 0-100 trust metric for integrity

//   // STREAKS / FOCUS METRICS
//   currentStreak?: number;
//   longestStreak?: number;
//   lastActiveDate?: Date | null;   // local date for streak calc
//   timezone?: string;              // e.g. 'Asia/Kolkata' (for day boundaries)

//   // SESSIONS / TIMERS
//   currentSession?: IFocusSession | null; // quick lookup for live session
//   // For scale, keep canonical sessions in separate collection; store only small recent cache here.

//   // MENTOR-SPECIFIC
//   isMentor?: boolean;
//   mentorProfile?: {
//     bio?: string;
//     subjects?: string[];
//     ratePerMin?: number;       // base rate mentor expects
//     payoutPending?: number;    // decimal
//     payoutHistory?: { id?: string; amount?: number; date?: Date }[];
//     mentorWalletId?: string;   // if using separate wallet collection
//     isVerified?: boolean;
//   };

//   // ADMIN / DISPUTES
//   pendingDisputes?: string[]; // dispute IDs
//   createdAt?: Date;
//   updatedAt?: Date;
// }
