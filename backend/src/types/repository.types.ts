import { Role } from './role.types';

export type UserUpdateData = Partial<{
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    bio?: string;
    headline?: string;
    avatarUrl?: string;
    joinedAt?: string;
    dob?: string;
    subscription?: string;
}>;
