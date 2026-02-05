import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import Wallet, {
    IWallet,
    TransactionStatus,
    TransactionType,
} from '@/models/Wallet.model';
import { IWalletRepository } from './interfaces/IWallet.repository';
import { ObjectId, PipelineStage } from 'mongoose';
import { ITransaction } from '@/models/Wallet.model';

@injectable()
export class WalletRepository
    extends BaseRepository<IWallet>
    implements IWalletRepository
{
    constructor() {
        super(Wallet);
    }

    async findByMentorId(mentorId: string | ObjectId): Promise<IWallet | null> {
        return await Wallet.findOne({ mentorId });
    }

    async creditPendingBalance(
        mentorId: string | ObjectId,
        amount: number,
        description: string
    ): Promise<void> {
        let wallet = await this.findByMentorId(mentorId);
        if (!wallet) {
            wallet = await this.create({
                mentorId,
                balance: 0,
                pendingBalance: 0,
                transactions: [],
            } as Partial<IWallet>);
        }

        wallet.pendingBalance += amount;
        wallet.transactions.push({
            amount,
            type: TransactionType.EARNING,
            status: TransactionStatus.PENDING,
            description,
            date: new Date(),
        });

        await wallet.save();
    }

    async releasePendingBalance(
        mentorId: string | ObjectId,
        amount: number
    ): Promise<void> {
        const wallet = await this.findByMentorId(mentorId);
        if (!wallet) return;

        wallet.pendingBalance -= amount;
        wallet.balance += amount;

        if (wallet.pendingBalance < 0) wallet.pendingBalance = 0;

        wallet.transactions.push({
            amount,
            type: TransactionType.EARNING,
            status: TransactionStatus.COMPLETED,
            description: 'Funds Unlocked - Mentorship Completed',
            date: new Date(),
        });
        await wallet.save();
    }

    async debitPendingBalance(
        mentorId: string | ObjectId,
        amount: number
    ): Promise<void> {
        const wallet = await this.findByMentorId(mentorId);
        if (!wallet) return;

        wallet.pendingBalance -= amount;
        if (wallet.pendingBalance < 0) wallet.pendingBalance = 0;

        wallet.transactions.push({
            amount,
            type: TransactionType.REFUND,
            status: TransactionStatus.COMPLETED,
            description: 'Refund/Cancellation Deduction',
            date: new Date(),
        });
        await wallet.save();
    }

    async findByUserId(userId: string | ObjectId): Promise<IWallet | null> {
        return await Wallet.findOne({ userId });
    }

    async creditBalance(
        userId: string | ObjectId,
        amount: number,
        description: string
    ): Promise<void> {
        let wallet = await this.findByUserId(userId);
        if (!wallet) {
            wallet = await this.create({
                userId,
                balance: 0,
                pendingBalance: 0,
                transactions: [],
            } as Partial<IWallet>);
        }

        wallet.balance += amount;
        wallet.transactions.push({
            amount,
            type: TransactionType.REFUND,
            status: TransactionStatus.COMPLETED,
            description,
            date: new Date(),
        });

        await wallet.save();
    }

    async findAllWallets(): Promise<IWallet[]> {
        return await Wallet.find()
            .populate('mentorId', 'name email')
            .populate('userId', 'name email');
    }

    async getGlobalTransactions(
        page: number,
        limit: number,
        filter: 'all' | 'mentor' | 'user'
    ): Promise<{ transactions: ITransaction[]; total: number }> {
        const match: Record<string, unknown> = {};
        if (filter === 'mentor') match.mentorId = { $exists: true };
        if (filter === 'user') match.userId = { $exists: true };

        const pipeline: PipelineStage[] = [
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
        const data = result[0].data as ITransaction[];
        const total = result[0].metadata[0]?.total || 0;

        return { transactions: data, total };
    }

    async findPaginatedTransactions(
        walletId: string | ObjectId,
        page: number,
        limit: number
    ): Promise<{ transactions: ITransaction[]; total: number }> {
        const pipeline: PipelineStage[] = [
            { $match: { _id: new Wallet.base.Types.ObjectId(walletId.toString()) } },
            { $unwind: '$transactions' },
            { $sort: { 'transactions.date': -1 } },
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                },
            },
        ];

        const result = await Wallet.aggregate(pipeline);
        const data = result[0].data.map((item: any) => item.transactions);
        const total = result[0].metadata[0]?.total || 0;

        return { transactions: data, total };
    }
}
