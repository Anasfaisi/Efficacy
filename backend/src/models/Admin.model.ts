import { Role } from '@/types/role.types';
import mongoose from 'mongoose';
import { Document, Schema, model } from 'mongoose';

export interface IAdmin extends Document {
    id: string;
    email: string;
    password: string;
    role: Role;
    name: string;
}

const adminSchema = new Schema<IAdmin>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.Admin },
});

const AdminModel = model<IAdmin>('Admin', adminSchema);
export default AdminModel;
