import { BaseRepository } from './base.repository';
import { IUserRepository } from './interfaces/IUser.repository';
import User, { IUser } from '../models/User.model';
import { Role } from '@/types/role.types';
import { UserUpdateData } from '@/types/repository.types';
import { ISubscription } from '@/models/subscription.model';

export class UserRepository
    extends BaseRepository<IUser>
    implements IUserRepository
{
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await this.findOne({ email });
    }

    async createUser(data: {
        email: string;
        password: string;
        name: string;
        role: Role.User;
    }): Promise<IUser> {
        return this.create(data);
    }
    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    async updatePasswordById(
        userId: string,
        newPassword: string
    ): Promise<void> {
        await User.updateOne(
            { _id: userId },
            { $set: { password: newPassword } }
        );
    }

    async updateSubscriptionByEmail(
        email: string,
        subscriptionData: ISubscription
    ): Promise<IUser | null> {
        return User.findOneAndUpdate(
            { email },
            { $set: { subscription: subscriptionData } },
            { new: true }
        );
    }

    async updateSubscriptionById(
        userId: string,
        subscriptionData: ISubscription
    ): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            userId,
            { $set: { subscription: subscriptionData } },
            { new: true }
        );
    }

    async findByStripeCustomerId(customerId: string): Promise<IUser | null> {
        return User.findOne({ stripeCustomerId: customerId }).exec();
    }

    async updateUser(updatedData: UserUpdateData): Promise<IUser | null> {
        const updatedUser = await User.findByIdAndUpdate(
            updatedData.id,
            { ...updatedData },
            { new: true, runValidators: true }
        ).exec();
        return updatedUser;
    }

    async updateProfilePic(id: string, fileUrl: string): Promise<IUser | null> {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { profilePic: fileUrl },
            { new: true, runValidators: true }
        ).exec();

        return updatedUser;
    }
}

/*await userRepository.updateSubscriptionByEmail(customerEmail, {
  id: subscription.id,
  status: subscription.status,
  priceId: subscription.items.data[0].price.id,
  current_period_end: new Date(subscription.current_period_end * 1000),
}); */
