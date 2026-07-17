"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_types_1 = require("@/types/role.types");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userId: { type: String },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(role_types_1.Role), default: role_types_1.Role.User },
    bio: { type: String },
    headline: { type: String },
    profilePic: { type: String },
    dob: { type: String },
    stripeCustomerId: { type: String },
    subscription: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subscriptions',
    },
    walletBalance: { type: Number, default: 0 },
    walletCurrency: { type: String, default: 'INR' },
    xpPoints: { type: Number, default: 0 },
    badge: { type: [String], default: [] },
    league: { type: String, default: 'Beginner' },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    timezone: { type: String, default: 'UTC' },
    profileCompletion: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Users', userSchema);
//# sourceMappingURL=user.model.js.map