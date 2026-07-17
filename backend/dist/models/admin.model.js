"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_types_1 = require("@/types/role.types");
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(role_types_1.Role), default: role_types_1.Role.Admin },
    totalRevenue: { type: Number, default: 0 },
});
const AdminModel = (0, mongoose_1.model)('Admin', adminSchema);
exports.default = AdminModel;
//# sourceMappingURL=admin.model.js.map