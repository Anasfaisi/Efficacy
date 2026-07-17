"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionStatus = void 0;
const mongoose_1 = require("mongoose");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["INACTIVE"] = "inactive";
    SubscriptionStatus["CANCELLED"] = "cancelled";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
const subscriptionSchema = new mongoose_1.Schema({
    planId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Plan' },
    status: {
        type: String,
        enum: Object.values(SubscriptionStatus),
        default: SubscriptionStatus.INACTIVE,
    },
    stripeSubscriptionId: { type: String },
    currentPeriodEnd: { type: Date },
    sessionsBookedThisMonth: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Subscriptions', subscriptionSchema);
//# sourceMappingURL=subscription.model.js.map