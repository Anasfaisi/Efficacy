import { Schema, model, Document } from 'mongoose';

export interface IPlan extends Document {
    name: string;
    price: number;
    billingCycleDays: number;
    features: string[];
    limitations: Record<string, number>;
    isActive: boolean;
    mentorType?: string;
}

const planSchema = new Schema<IPlan>({
    name: { type: String, required: true },
    price: { type: Number },
    billingCycleDays: { type: Number },
    features: { type: [String] },
    limitations: { type: Object },
    isActive: { type: Boolean, default: true },
    mentorType: { type: String },
});

export default model<IPlan>('Plan', planSchema);
