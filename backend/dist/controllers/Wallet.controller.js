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
exports.WalletController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let WalletController = class WalletController {
    _walletService;
    constructor(_walletService) {
        this._walletService = _walletService;
    }
    async getWallet(req, res) {
        const userId = req.currentUser.id;
        const role = req.currentUser.role;
        const wallet = await this._walletService.getWallet(userId, role);
        res.status(200 /* code.OK */).json(wallet);
    }
    async requestWithdrawal(req, res) {
        const userId = req.currentUser.id;
        const { amount } = req.body;
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            res.status(400 /* code.BAD_REQUEST */).json({
                message: 'Please enter a valid withdrawal amount.',
            });
            return;
        }
        const amtNum = Number(amount);
        if (amtNum < 100) {
            res.status(400 /* code.BAD_REQUEST */).json({
                message: 'Minimum withdrawal amount is ₹100.',
            });
            return;
        }
        const wallet = await this._walletService.requestWithdrawal(userId, amtNum);
        res.status(200 /* code.OK */).json({
            message: response_messages_types_1.SuccessMessages.WithdrawalRequested,
            wallet,
        });
    }
    async getTransactions(req, res) {
        const userId = req.currentUser.id;
        const role = req.currentUser.role;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await this._walletService.getPaginatedTransactions(userId, role, page, limit);
        res.status(200 /* code.OK */).json({
            transactions: result.transactions,
            totalCount: result.total,
            totalPages: Math.ceil(result.total / limit),
            currentPage: page,
        });
    }
    async createStripeConnect(req, res) {
        const email = req.currentUser?.email;
        const mentorId = req.currentUser?.id;
        if (!email || !mentorId) {
            res.status(404 /* code.NOT_FOUND */);
            return;
        }
        const result = await this._walletService.createStripeConnect({
            email,
            mentorId,
        });
        res.status(200 /* code.OK */).json(result);
    }
    async verifyStripeStatus(req, res) {
        const mentorId = req.currentUser?.id;
        if (!mentorId) {
            res.status(404 /* code.NOT_FOUND */);
            return;
        }
        const result = await this._walletService.verifyStripeStatus(mentorId);
        res.status(200 /* code.OK */).json(result);
    }
};
exports.WalletController = WalletController;
exports.WalletController = WalletController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.WalletService)),
    __metadata("design:paramtypes", [Object])
], WalletController);
//# sourceMappingURL=Wallet.controller.js.map