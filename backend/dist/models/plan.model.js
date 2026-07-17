"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number },
    billingCycleDays: { type: Number },
    features: { type: [String] },
    limitations: { type: Object },
    isActive: { type: Boolean, default: true },
    mentorType: { type: String },
});
exports.default = (0, mongoose_1.model)('Plan', planSchema);
//# sourceMappingURL=plan.model.js.map