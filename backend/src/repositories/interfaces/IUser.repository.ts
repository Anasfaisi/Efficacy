import { ISubscription, IUser } from '@/models/User.model';
import { Role } from '@/types/role.types';

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    createUser(data: {
        email: string;
        password: string;
        name: string;
        role: Role.User;
        googleId?: string;
    }): Promise<IUser>;
    updatePasswordById(id: string, newPassword: string): Promise<void>;

    updateSubscriptionByEmail(
        email: string,
        subscriptionData: ISubscription
    ): Promise<IUser | null>;
    updateSubscriptionById(
        userId: string,
        subscriptionData: ISubscription
    ): Promise<IUser | null>;
    findByStripeCustomerId(customerId: string): Promise<IUser | null>;
}
