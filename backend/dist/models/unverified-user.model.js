"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_types_1 = require("@/types/role.types");
const mongoose_1 = require("mongoose");
const unverifiedUserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(role_types_1.Role), default: role_types_1.Role.User },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    lastOtpSent: { type: Date },
    resendAvailableAt: { type: Date },
    expiresAt: { type: Date, default: Date.now(), expires: 300 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('UnverifiedUsers', unverifiedUserSchema);
//# sourceMappingURL=unverified-user.model.js.map