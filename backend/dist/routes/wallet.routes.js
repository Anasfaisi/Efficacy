"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WalletRoutes;
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const role_types_1 = require("@/types/role.types");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
const express_1 = require("express");
function WalletRoutes(walletController, tokenService) {
    const router = (0, express_1.Router)();
    router.get('/', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(walletController.getWallet.bind(walletController)));
    router.post('/withdraw', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(walletController.requestWithdrawal.bind(walletController)));
    // router.patch(
    //     '/bank-details',
    //     authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
    //     asyncWrapper(walletController.updateBankDetails.bind(walletController))
    // );
    router.get('/transactions', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(walletController.getTransactions.bind(walletController)));
    router.post('/stripe-connect', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(walletController.createStripeConnect.bind(walletController)));
    router.get('/stripe-status', (0, authenticate_and_authorize_1.default)(tokenService, [role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(walletController.verifyStripeStatus.bind(walletController)));
    return router;
}
//# sourceMappingURL=wallet.routes.js.map