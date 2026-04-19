import mongoose, { Document, Schema, Types } from 'mongoose';
import {
    BadgeTemplate,
    GamificationEvent,
    Rarity,
    IconType
} from '../types/gamification.types';

export interface IBadge extends Document {
    name: string;
    story: string;
    template: BadgeTemplate;
    threshold: number;
    design: {
        iconType: IconType;
        iconName?: string;
        imageUrl?: string;
        primaryColor: string;
        bgColor: string;
        rarity: Rarity;
    };
    triggerEvent: GamificationEvent;
    isHidden: boolean;
    isActive: boolean;
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
const BadgeSchema = new Schema<IBadge>(
    {
        name: { type: String, required: true },
        story: { type: String, required: true },
        template: {
            type: String,
            enum: Object.values(BadgeTemplate),
            required: true,
        },
        threshold: { type: Number, required: true },
        design: {
            iconType: {
                type: String,
                enum: Object.values(IconType),
                required: true,
                default: IconType.ICON,
            },
            iconName: { type: String },
            imageUrl: { type: String },
            primaryColor: { type: String, required: true },
            bgColor: { type: String, required: true },
            rarity: {
                type: String,
                enum: Object.values(Rarity),
                default: Rarity.COMMON,
            },
        },
        triggerEvent: {
            type: String,
            enum: Object.values(GamificationEvent),
            required: true,
        },
        isHidden: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    },
    { timestamps: true }
);

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
