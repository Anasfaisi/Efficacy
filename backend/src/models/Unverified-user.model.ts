// backend/src/models/unverifiedUser.model.ts
import { Schema, model, Document, ObjectId } from 'mongoose';

interface IUnverifiedUser extends Document<ObjectId> {
    name: string;
    email: string;
    password: string;
    role: string;
    otp: string;
    otpExpiresAt: Date;
}

const unverifiedUserSchema = new Schema<IUnverifiedUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
});

export { IUnverifiedUser };
export default model<IUnverifiedUser>('UnverifiedUsers', unverifiedUserSchema);
