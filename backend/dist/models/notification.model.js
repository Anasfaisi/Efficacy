"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const notification_enum_1 = require("@/types/notification.enum");
const role_types_1 = require("@/types/role.types");
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    recipientId: {
        type: String,
        required: true,
        index: true,
    },
    recipientRole: {
        type: String,
        enum: Object.values(role_types_1.Role),
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(notification_enum_1.NotificationType),
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
exports.NotificationModel = (0, mongoose_1.model)('Notification', NotificationSchema);
//# sourceMappingURL=notification.model.js.map