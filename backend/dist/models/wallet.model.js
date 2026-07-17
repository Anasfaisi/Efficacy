"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
const mongoose_1 = require("mongoose");
var TransactionType;
(function (TransactionType) {
    TransactionType["EARNING"] = "earning";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["REFUND"] = "refund";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
const transactionSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
    },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    referenceId: { type: String },
});
const walletSchema = new mongoose_1.Schema({
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mentors',
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
    },
    balance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    pendingWithdrawal: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
    lifetimeEarnings: { type: Number, default: 0 },
    transactions: [transactionSchema],
    bankAccountDetails: {
        accountNumber: { type: String },
        bankName: { type: String },
        ifscCode: { type: String },
        accountHolderName: { type: String },
    },
    stripeConnectAccountId: { type: String },
    stripeConnectOnboarded: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Wallets', walletSchema);
//# sourceMappingURL=wallet.model.js.map