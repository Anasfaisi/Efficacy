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
exports.BadgeController = void 0;
const inversify_key_types_1 = require("@/config/inversify-key.types");
const inversify_1 = require("inversify");
const response_messages_types_1 = require("@/types/response-messages.types");
let BadgeController = class BadgeController {
    _badgeService;
    constructor(_badgeService) {
        this._badgeService = _badgeService;
    }
    async CreateBadge(req, res) {
        const badgeData = req.body;
        const newBadge = await this._badgeService.createBadge(badgeData);
        res.status(201 /* Code.CREATED */).json({ success: true, badge: newBadge });
    }
    async getAllBadges(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;
        const result = await this._badgeService.getAllBadges(page, limit);
        res.status(200 /* Code.OK */).json({ success: true, ...result });
    }
    async getBadgeById(req, res) {
        const badgeId = req.params.id;
        const badge = await this._badgeService.getBadgeById(badgeId);
        if (!badge) {
            res.status(404 /* Code.NOT_FOUND */).json({
                status: false,
                message: 'Badge not found',
            });
            return;
        }
        res.status(200 /* Code.OK */).json({ success: true, badge });
    }
    async updateBadge(req, res) {
        const badgeId = req.params.badgeId;
        const badgeData = req.body;
        const updatedBadge = await this._badgeService.updateBadge(badgeId, badgeData);
        if (!updatedBadge) {
            res.status(404 /* Code.NOT_FOUND */).json({
                success: false,
                message: 'Badge not found',
            });
            return;
        }
        res.status(200 /* Code.OK */).json({ status: true, updatedBadge });
    }
    async toggleBadgeStatus(req, res) {
        const badgeId = req.params.badgeId;
        const status = req.body.status;
        const result = await this._badgeService.toggleBadgeStatus(badgeId, status);
        res.status(200 /* Code.OK */).json({ status: true, badge: result });
    }
    async getUserBadges(req, res) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* Code.UNAUTHORIZED */).json({
                message: response_messages_types_1.ErrorMessages.UserNotFound,
            });
            return;
        }
        const result = await this._badgeService.getUserBadges(userId);
        res.status(200 /* Code.OK */).json({ status: true, badges: result });
    }
};
exports.BadgeController = BadgeController;
exports.BadgeController = BadgeController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BadgeService)),
    __metadata("design:paramtypes", [Object])
], BadgeController);
//# sourceMappingURL=badge.controller.js.map