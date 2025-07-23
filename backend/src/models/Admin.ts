// backend/src/models/Admin.ts
import mongoose from 'mongoose';
import {Document, Schema,model} from 'mongoose'

export interface IAdmin extends Document {
  id: string;
  email: string;
  password: string;
  role: string;
}

const adminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
});

const AdminModel = model<IAdmin>('Admin', adminSchema);
export default AdminModel;