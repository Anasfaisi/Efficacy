import mongoose, { Schema } from 'mongoose';
import {
    BadgeTemplate,
    GamificationEvent,
    IBadge,
} from '../types/gamification.types';

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
                enum: ['icon', 'image'],
                required: true,
                default: 'icon',
            },
            iconName: { type: String },
            imageUrl: { type: String },
            primaryColor: { type: String, required: true },
            bgColor: { type: String, required: true },
            rarity: {
                type: String,
                enum: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],
                default: 'COMMON',
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
