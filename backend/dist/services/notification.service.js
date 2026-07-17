"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const inversify_1 = require("inversify");
const role_types_1 = require("@/types/role.types");
const inversify_key_types_1 = require("@/config/inversify-key.types");
let NotificationService = class NotificationService {
    _notificationRepository;
    _socketService;
    constructor(_notificationRepository, _socketService) {
        this._notificationRepository = _notificationRepository;
        this._socketService = _socketService;
    }
    async createNotification(recipientId, recipientRole, type, title, message, metadata) {
        const notification = await this._notificationRepository.create({
            recipientId,
            recipientRole,
            type,
            title,
            message,
            metadata,
            isRead: false,
        });
        this._socketService.emitNotification(recipientId, notification);
        return notification;
    }
    async getNotificationsByRecipient(recipientId) {
        return this._notificationRepository.findByRecipient(recipientId);
    }
    async markAsRead(notificationId) {
        await this._notificationRepository.updateOne(notificationId, {
            isRead: true,
        });
    }
    async markAllAsRead(recipientId) {
        await this._notificationRepository.updateMany({ recipientId, isRead: false }, { isRead: true });
    }
    async notifyAdmin(type, title, message, metadata) {
        await this.createNotification('admin_global', role_types_1.Role.Admin, type, title, message, metadata);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NotificationRepository)),
    __param(1, (0, inversify_1.inject)(inversify_key_types_1.TYPES.SocketService)),
    __metadata("design:paramtypes", [Object, Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map