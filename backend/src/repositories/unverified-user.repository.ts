import UnverifiedUserModel, {
    IUnverifiedUser,
} from '@/models/Unverified-user.model';
import { IUnverifiedUserRepository } from './interfaces/IUnverified-user.repository';

export class UnverifiedUserRepository implements IUnverifiedUserRepository {
    async findByEmail(email: string) {
        return UnverifiedUserModel.findOne({ email });
    }

    async create(data: Partial<IUnverifiedUser>) {
        return UnverifiedUserModel.create(data);
    }

    async deleteByEmail(email: string) {
        return UnverifiedUserModel.deleteOne({ email });
    }

    async updateByEmail(
        email: string,
        updateData: Partial<IUnverifiedUser>
    ): Promise<IUnverifiedUser | null> {
        return UnverifiedUserModel.findOneAndUpdate(
            { email },
            { $set: updateData },
            { new: true }
        );
    }
}
