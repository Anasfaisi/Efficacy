import { injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import Wallet, { IWallet } from '@/models/Wallet.model';
import { IWalletRepository } from './interfaces/IWallet.repository';
import { ObjectId } from 'mongoose';

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
}
