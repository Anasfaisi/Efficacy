// backend/src/models/unverifiedUser.model.ts
import { Role } from '@/types/role.types';
import { Schema, model, Document, ObjectId } from 'mongoose';

interface IUnverifiedUser extends Document<ObjectId> {
    name: string;
    email: string;
    password: string;
    role: Role;
    otp: string;
    otpExpiresAt: Date;
    lastOtpSent: Date;
    resendAvailableAt: Date;
    expiresAt: Date;
}

const unverifiedUserSchema = new Schema<IUnverifiedUser>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: Object.values(Role), default: Role.User },
        otp: { type: String, required: true },
        otpExpiresAt: { type: Date, required: true },
        lastOtpSent: { type: Date },
        resendAvailableAt: { type: Date },
        expiresAt: { type: Date, default: Date.now(), expires: 300 },
    },
    { timestamps: true }
);

export { IUnverifiedUser };
export default model<IUnverifiedUser>('UnverifiedUsers', unverifiedUserSchema);
