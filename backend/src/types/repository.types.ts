import { Role } from './role.types';

export type UserUpdateData = Partial<{
    name: string;
    userId: string;
    email: string;
    password: string;
    role: Role;
    bio?: string;
    headline?: string;
    profilePic?: string;
    joinedAt?: string;
    dob?: string;
    subscription?: string;
    isActive?: boolean;
}>;
