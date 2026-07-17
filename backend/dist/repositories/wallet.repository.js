"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const inversify_1 = require("inversify");
const base_repository_1 = require("./base.repository");
const wallet_model_1 = __importStar(require("@/models/wallet.model"));
const wallet_mapper_1 = require("@/Mapper/wallet.mapper");
let WalletRepository = class WalletRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(wallet_model_1.default);
    }
    async createWallet(data) {
        const persistence = wallet_mapper_1.WalletMapper.ToPersistence(data);
        const result = await this.create(persistence);
        return wallet_mapper_1.WalletMapper.ToEntity(result);
    }
    async findWalletById(walletId) {
        const wallet = await super.findById(walletId);
        if (!wallet)
            return null;
        return wallet_mapper_1.WalletMapper.ToEntity(wallet);
    }
    async findByMentorId(mentorId) {
        if (!mentorId ||
            mentorId.toString() === 'null' ||
            mentorId.toString() === 'undefined')
            return null;
        const wallet = await wallet_model_1.default.findOne({ mentorId });
        if (!wallet)
            return null;
        return wallet_mapper_1.WalletMapper.ToEntity(wallet);
    }
    async creditPendingBalance(mentorId, amount, description) {
        let wallet = await this.findByMentorId(mentorId);
        if (!wallet) {
            wallet = await this.createWallet({
                mentorId: mentorId.toString(),
                balance: 0,
                pendingBalance: 0,
                transactions: [],
            });
        }
        if (!wallet)
            return;
        wallet.pendingBalance += amount;
        wallet.transactions.push({
            amount,
            type: wallet_model_1.TransactionType.EARNING,
            status: wallet_model_1.TransactionStatus.PENDING,
            description,
            date: new Date(),
        });
        await this.updateWallet(wallet.id, wallet);
    }
    async releasePendingBalance(mentorId, amount) {
        const wallet = await this.findByMentorId(mentorId);
        if (!wallet)
            return;
        wallet.pendingBalance -= amount;
        wallet.balance += amount;
        if (wallet.pendingBalance < 0)
            wallet.pendingBalance = 0;
        wallet.transactions.push({
            amount,
            type: wallet_model_1.TransactionType.EARNING,
            status: wallet_model_1.TransactionStatus.COMPLETED,
            description: 'Funds Unlocked - Mentorship Completed',
            date: new Date(),
        });
        await this.updateWallet(wallet.id, wallet);
    }
    async debitPendingBalance(mentorId, amount) {
        const wallet = await this.findByMentorId(mentorId);
        if (!wallet)
            return;
        wallet.pendingBalance -= amount;
        if (wallet.pendingBalance < 0)
            wallet.pendingBalance = 0;
        wallet.transactions.push({
            amount,
            type: wallet_model_1.TransactionType.REFUND,
            status: wallet_model_1.TransactionStatus.COMPLETED,
            description: 'Refund/Cancellation Deduction',
            date: new Date(),
        });
        await this.updateWallet(wallet.id, wallet);
    }
    async findByUserId(userId) {
        if (!userId ||
            userId.toString() === 'null' ||
            userId.toString() === 'undefined')
            return null;
        return await wallet_model_1.default.findOne({ userId });
    }
    // async creditBalance(
    //     userId: ObjectId,
    //     amount: number,
    //     description: string
    // ): Promise<void> {
    //     if (
    //         !userId ||
    //         userId.toString() === 'null' ||
    //         userId.toString() === 'undefined'
    //     ) {
    //         console.error('Attempted to credit wallet with nullish user ID');
    //         return;
    //     }
    //     let wallet = await this.findByUserId(userId);
    //     if (!wallet) {
    //         if (
    //             !userId ||
    //             userId.toString() === 'null' ||
    //             userId.toString() === 'undefined'
    //         ) {
    //             console.error(
    //                 'Attempted to create user wallet with nullish ID'
    //             );
    //             return;
    //         }
    //         wallet = await this.create({
    //             userId,
    //             balance: 0,
    //             pendingBalance: 0,
    //             transactions: [],
    //         });
    //     }
    //     wallet.balance += amount;
    //     wallet.transactions.push({
    //         amount,
    //         type: TransactionType.REFUND,
    //         status: TransactionStatus.COMPLETED,
    //         description,
    //         date: new Date(),
    //     });
    //     await wallet.save();
    // }
    async findAllWallets() {
        return await wallet_model_1.default.find()
            .populate('mentorId', 'name email')
            .populate('userId', 'name email');
    }
    async getGlobalTransactions(page, limit, filter) {
        const match = {};
        if (filter === 'mentor')
            match.mentorId = { $exists: true };
        if (filter === 'user')
            match.userId = { $exists: true };
        const pipeline = [
            { $match: match },
            { $unwind: '$transactions' },
            { $sort: { 'transactions.date': -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $lookup: {
                    from: 'mentors',
                    localField: 'mentorId',
                    foreignField: '_id',
                    as: 'mentorDetails',
                },
            },
            {
                $project: {
                    _id: 0,
                    walletId: '$_id',
                    transactionId: '$transactions._id',
                    amount: '$transactions.amount',
                    type: '$transactions.type',
                    status: '$transactions.status',
                    description: '$transactions.description',
                    date: '$transactions.date',
                    referenceId: '$transactions.referenceId',
                    user: {
                        name: { $arrayElemAt: ['$userDetails.name', 0] },
                        email: { $arrayElemAt: ['$userDetails.email', 0] },
                    },
                    mentor: {
                        name: { $arrayElemAt: ['$mentorDetails.name', 0] },
                        email: { $arrayElemAt: ['$mentorDetails.email', 0] },
                    },
                    bankAccountDetails: '$bankAccountDetails',
                    stripeConnectAccountId: '$stripeConnectAccountId',
                    stripeConnectOnboarded: '$stripeConnectOnboarded',
                },
            },
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                },
            },
        ];
        const result = await this.model.aggregate(pipeline);
        const data = result[0].data;
        const total = result[0].metadata[0]?.total || 0;
        return { transactions: data, total };
    }
    async findPaginatedTransactions(walletId, page, limit) {
        const pipeline = [
            {
                $match: {
                    _id: new wallet_model_1.default.base.Types.ObjectId(walletId.toString()),
                },
            },
            { $unwind: '$transactions' },
            { $sort: { 'transactions.date': -1 } },
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                },
            },
        ];
        const result = await wallet_model_1.default.aggregate(pipeline);
        const data = result[0].data.map((item) => item.transactions);
        const total = result[0].metadata[0]?.total || 0;
        return { transactions: data, total };
    }
    async updateStripeConnectId(mentorId, accountId) {
        await this.model.updateOne({ mentorId: mentorId }, { $set: { stripeConnectAccountId: accountId } });
    }
    async updateWallet(walletId, wallet) {
        const persistence = wallet_mapper_1.WalletMapper.ToPersistence(wallet);
        await this.update(walletId, persistence);
    }
};
exports.WalletRepository = WalletRepository;
exports.WalletRepository = WalletRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], WalletRepository);
//# sourceMappingURL=wallet.repository.js.map