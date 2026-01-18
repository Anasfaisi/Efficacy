import { IWallet } from '@/models/Wallet.model';
import { IBaseRepository } from './IBase.repository';
import { ObjectId } from 'mongoose';

export interface IWalletRepository extends IBaseRepository<IWallet> {
    findByMentorId(mentorId: string | ObjectId): Promise<IWallet | null>;
}
