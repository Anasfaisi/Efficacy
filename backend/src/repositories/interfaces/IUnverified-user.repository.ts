// backend/src/interfaces/unverifiedUserRepository.interface.ts

import { IUnverifiedUser } from "@/models/Unverified-user";

export interface IUnverifiedUserRepository {
  findByEmail(email: string): Promise<IUnverifiedUser | null>;
  create(data: Partial<IUnverifiedUser>): Promise<IUnverifiedUser>;
  deleteByEmail(email: string): Promise<{ deletedCount?: number }>;
}
